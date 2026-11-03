#!/usr/bin/env node
// Checks for the case studies: an anti-fluff scrubber for the words on the page, a TypeScript check,
// and (with --build) a full production build in a throwaway copy, so a running `next dev` keeps its
// own .next folder.
//
//   node scripts/case-study-check.mjs [files…]   scrub the files (default: every case study), then type-check
//   node scripts/case-study-check.mjs --build    the same, then a full `next build` in a temp copy
//   node scripts/case-study-check.mjs --hook     for the Claude Code PostToolUse hook: reads the hook's
//                                                JSON on stdin and checks only the file just edited
//
// Errors (AI filler, a failed type check or build) exit 1, or 2 in hook mode so Claude sees them.
// Warnings (passive voice, long paragraphs) are reported but don't fail.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const hook = args.includes('--hook');
const build = args.includes('--build');

// Files that count as case-study content
const isCaseStudy = (f) => {
  const r = relative(root, f);
  // Markdown only at the root (versum-case-study.md), so agent and rule files that quote the banned words don't trip it
  return !r.startsWith('..') && (/^app\/work\/[^/]+\/page\.tsx$/.test(r) || /^app\/components\/case\//.test(r) || /^[^/]*case-study[^/]*\.md$/i.test(r) || r === 'app/components/FeaturedWork.tsx' || r === 'app/data/projects.ts');
};
const allCaseStudies = () => [
  ...readdirSync(join(root, 'app/work'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(root, 'app/work', d.name, 'page.tsx')))
    .map((d) => join(root, 'app/work', d.name, 'page.tsx')),
  ...readdirSync(root).filter((f) => /case-study.*\.md$/i.test(f)).map((f) => join(root, f)),
];

// ---------- the scrubber ----------
// Words and phrases that read as generated filler. Each is an error.
const FILLER = [
  'leverag(e|es|ed|ing)', 'seamless(ly)?', 'delv(e|es|ed|ing)', 'testament', 'tapestry', 'user-centric( approach)?',
  'foster(s|ed|ing)?', 'robust', 'elevat(e|es|ed|ing)', 'empower(s|ed|ing|ment)?', 'unlock(s|ed|ing)?', 'cutting-edge',
  'game-?chang(er|ing)', 'revolutioniz(e|es|ed|ing)', 'holistic', 'synerg(y|ies|istic)', 'utiliz(e|es|ed|ing|ation)',
  'in order to', "it[’']s worth noting", 'dive into', 'deep dive', 'navigat(e|ing) the complexities', 'ever-evolving',
  'a myriad of', 'boasts?', 'meticulous(ly)?', 'pivotal', 'paramount', 'streamlin(e|es|ed|ing)', 'innovative',
  'best-in-class', 'world-class', 'harness(es|ed|ing)?', 'embark(s|ed|ing)?', 'realm', 'nuanced', 'transformative',
  'delightful(ly)?', 'state-of-the-art', 'next-level', 'at the end of the day', 'it goes without saying',
];
// Softer tells: worth a second look, not wrong on their own
const SOFT = [
  ['intensifier', /\b(very|really|truly|incredibly|extremely|super|highly)\b/gi],
  ['vague value word', /\b(intuitive(ly)?|crucial|key insights?|impactful|engaging|powerful)\b/gi],
  ['"journey" outside a journey map', /\bjourney(?! map)\b/gi],
  ['passive deflection', /\b(was|were|is|are|been|being|got)\s+(made|decided|chosen|done|implemented|designed|built|created|added|conducted|taken|given|identified|determined|found)\b/gi],
  ['exclamation mark', /(?<![<!])!(?![=-])/g],
];
const FILLER_RE = new RegExp(`\\b(${FILLER.join('|')})\\b`, 'gi');

// Text a reader sees: drop imports, comments, and attribute values that aren't prose (paths, ids,
// classes), and alt text (it describes the screen, so "the loop was added" there is fine)
function proseLines(src, isMd) {
  if (isMd) return src.split('\n');
  const noBlock = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  return noBlock.split('\n').map((line) => {
    if (/^\s*import\s/.test(line)) return '';
    return line
      .replace(/(^|[^:])\/\/.*$/, '$1')
      .replace(/\b(alt|label|src|href|poster|className|id|key|type|aria-[a-z]+)\s*[:=]\s*(['"`])(?:\\.|(?!\2).)*\2/g, '')
      .replace(/\b(alt|label|src|href|poster|className|id)\s*[:=]\s*\{[^}]*\}/g, '');
  });
}

// The paragraphs: <p>…</p> and the string props that hold running text
function paragraphs(src) {
  const out = [];
  const lineOf = (i) => src.slice(0, i).split('\n').length;
  for (const m of src.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) out.push({ line: lineOf(m.index), text: m[1] });
  for (const m of src.matchAll(/\b(summary|subtitle|learned|why|did|found|problem|outcome|caption|note|line)=(["'])((?:\\.|(?!\2).)*)\2/g)) out.push({ line: lineOf(m.index), text: m[3] });
  return out.map((p) => ({ ...p, text: p.text.replace(/<[^>]+>/g, ' ').replace(/\{[^}]*\}/g, ' ').replace(/\s+/g, ' ').trim() })).filter((p) => p.text);
}

function scrub(file) {
  const src = readFileSync(file, 'utf8');
  const isMd = file.endsWith('.md');
  const rel = relative(root, file);
  const found = [];
  proseLines(src, isMd).forEach((line, i) => {
    for (const m of line.matchAll(FILLER_RE)) found.push({ level: 'error', at: `${rel}:${i + 1}`, rule: 'AI filler', text: m[0] });
    for (const [rule, re] of SOFT) for (const m of line.matchAll(re)) found.push({ level: 'warn', at: `${rel}:${i + 1}`, rule, text: m[0].trim() });
  });
  if (!isMd) {
    for (const p of paragraphs(src)) {
      const words = p.text.split(' ').length;
      const sentences = p.text.split(/(?<=[.?!])\s+(?=[A-Z“"])/).filter(Boolean);
      if (sentences.length > 4 || words > 80) found.push({ level: 'warn', at: `${rel}:${p.line}`, rule: 'long paragraph', text: `${sentences.length} sentences, ${words} words` });
      for (const s of sentences) {
        const n = s.split(' ').length;
        if (n > 38) found.push({ level: 'warn', at: `${rel}:${p.line}`, rule: 'long sentence', text: `${n} words: “${s.slice(0, 60)}…”` });
      }
    }
  }
  return found;
}

// ---------- type check and build ----------
function typecheck() {
  try {
    execFileSync('npx', ['tsc', '--noEmit', '-p', root], { cwd: root, stdio: 'pipe' });
    return null;
  } catch (e) {
    return String(e.stdout || e.message).trim().split('\n').slice(0, 20).join('\n');
  }
}

function isolatedBuild() {
  const dir = join(tmpdir(), 'portfolio-build-check');
  mkdirSync(dir, { recursive: true });
  execFileSync('rsync', ['-a', '--delete', '--exclude', 'node_modules', '--exclude', '.next', '--exclude', '.git', '--exclude', '*.tsbuildinfo', `${root}/`, `${dir}/`]);
  if (!existsSync(join(dir, 'node_modules'))) symlinkSync(join(root, 'node_modules'), join(dir, 'node_modules'));
  const r = spawnSync('npx', ['next', 'build'], { cwd: dir, encoding: 'utf8', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
  return r.status === 0 ? null : (r.stdout + r.stderr).trim().split('\n').slice(-25).join('\n');
}

// ---------- run ----------
let files;
if (hook) {
  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
  const f = input.tool_input?.file_path || input.tool_response?.filePath;
  if (!f || !isCaseStudy(resolve(f)) || !existsSync(f)) process.exit(0);
  files = [resolve(f)];
} else {
  const named = args.filter((a) => !a.startsWith('--')).map((a) => resolve(a));
  files = named.length ? named : allCaseStudies();
}

const findings = files.flatMap(scrub);
const tsError = typecheck();
const buildError = build && !tsError ? isolatedBuild() : null;
const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');

const lines = [];
for (const f of [...errors, ...warns]) lines.push(`${f.level === 'error' ? 'ERROR' : 'warn '}  ${f.at}  ${f.rule}: ${f.text}`);
if (tsError) lines.push(`ERROR  TypeScript check failed:\n${tsError}`);
if (buildError) lines.push(`ERROR  next build failed:\n${buildError}`);
const failed = errors.length > 0 || Boolean(tsError) || Boolean(buildError);
const summary = `Case-study check: ${files.length} file(s), ${errors.length} error(s), ${warns.length} warning(s); TypeScript ${tsError ? 'failed' : 'passed'}${build ? `; build ${buildError ? 'failed' : tsError ? 'skipped' : 'passed'}` : ''}.`;

if (hook) {
  if (failed) {
    process.stderr.write(`${summary}\n${lines.join('\n')}\nFix the errors; rewrite filler in plain first person, and keep every claim grounded in the source.\n`);
    process.exit(2);
  }
  if (warns.length) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `${summary}\n${lines.join('\n')}` } }));
  }
  process.exit(0);
}
console.log(lines.length ? `${lines.join('\n')}\n\n${summary}` : summary);
process.exit(failed ? 1 : 0);
