#!/usr/bin/env node
// Automatic Codex review, for the Claude Code Stop hook. When Claude finishes a turn and case-study
// files have changed since the last review, this writes agent-handoff/request.md, runs the read-only
// Codex review (scripts/codex-review.py) and reads the answer:
//   - REVISE: blocks the stop and hands Codex's findings to Claude, which keeps working on them
//   - PASS: lets the turn end and shows the verdict
// At most three reviews per user turn (two fix rounds, as CLAUDE.md asks). Files that haven't changed
// since the last review aren't sent again, so a turn with nothing new to fix ends quietly.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const handoff = join(root, 'agent-handoff');
const statePath = join(handoff, '.auto-review.json');
const MAX_REVIEWS = 3;

const say = (out) => { process.stdout.write(JSON.stringify(out)); process.exit(0); };

let input = {};
try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* no input: treat as a fresh stop */ }

// The case-study files, and a fingerprint of each
const files = [];
const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts|css|md)$/.test(e)) files.push(p);
  }
};
walk(join(root, 'app/work'));
walk(join(root, 'app/components/case'));
for (const f of readdirSync(root)) if (/case-study.*\.md$/i.test(f)) files.push(join(root, f));
// The case-study cards on /work: their component and their words
for (const f of ['app/components/FeaturedWork.tsx', 'app/data/projects.ts']) if (existsSync(join(root, f))) files.push(join(root, f));
const hashes = Object.fromEntries(files.map((f) => [relative(root, f), createHash('sha1').update(readFileSync(f)).digest('hex')]));

const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { hashes: {}, reviews: 0 };
// A stop that isn't a continuation of this hook's own block starts a new count
if (!input.stop_hook_active) state.reviews = 0;
const changed = Object.keys(hashes).filter((f) => state.hashes[f] !== hashes[f]);
const removed = Object.keys(state.hashes).filter((f) => !(f in hashes));
if (!changed.length && !removed.length) process.exit(0);

if (state.reviews >= MAX_REVIEWS) {
  say({ systemMessage: `Codex auto-review: stopped after ${MAX_REVIEWS} reviews this turn. The latest findings are in agent-handoff/response.md.` });
}
if (existsSync(join(handoff, '.review-lock'))) {
  say({ systemMessage: 'Codex auto-review skipped: another review is running (agent-handoff/.review-lock).' });
}

// The request
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*/, '').replace('T', '-');
const round = state.reviews + 1;
const id = `auto-${stamp}-r${round}`;
const list = (xs) => xs.map((f) => `- ${f}`).join('\n');
writeFileSync(join(handoff, 'request.md'), `# Claude → Codex review request

Request ID: ${id}
Round: ${round}
Task: Automatic review. A Claude Code turn just changed case-study files. Review the changed files in full, with the shared components they use, against CASE_STUDY_REVIEW.md. Read-only. Report concrete defects and regressions (unsupported claims, broken evidence, inconsistencies, presentation problems), and mark findings that need the author's input. Don't repeat findings that are only polish.
${state.lastId ? `Previous automatic review: ${state.lastId}. Confirm whether its findings are resolved in the changed files.\n` : ''}
Changed since the last review:
${list(changed)}${removed.length ? `\nRemoved:\n${list(removed)}` : ''}

Return this request ID; PASS or REVISE; findings with IDs, file/line and fix; author-input questions; verification limits. Under 400 words.
`);

const run = spawnSync('python3', [join(root, 'scripts/codex-review.py')], { cwd: root, encoding: 'utf8' });
if (run.status !== 0) {
  say({ systemMessage: `Codex auto-review failed: ${(run.stderr || run.stdout || 'no output').trim().split('\n').pop()}` });
}
const reply = readFileSync(join(handoff, 'response.md'), 'utf8');
if (!reply.includes(id)) {
  say({ systemMessage: `Codex auto-review: the reply in agent-handoff/response.md doesn't carry request ID ${id}, so it isn't treated as a fresh result.` });
}

writeFileSync(statePath, JSON.stringify({ hashes, reviews: round, lastId: id }, null, 2));
const head = reply.slice(0, 600);
const revise = /\bREVISE\b/.test(head) && !/\bPASS\b/.test(head.split('\n').slice(0, 4).join('\n'));
if (revise && round < MAX_REVIEWS) {
  say({
    decision: 'block',
    reason: `Codex auto-review ${id} (round ${round} of ${MAX_REVIEWS}) returned REVISE. Fix the concrete, in-scope findings in the files you changed this turn; don't edit files another agent owns, and don't invent facts: list anything that needs the author's input for the user instead. Then finish your answer, including Codex's verdict.\n\n${reply}`,
  });
}
say({ systemMessage: `Codex auto-review ${id}: ${revise ? 'REVISE (review limit reached; see agent-handoff/response.md)' : 'PASS'}.` });
