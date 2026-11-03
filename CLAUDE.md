# Case-study review

Whenever a Claude Code task changes case-study content or presentation, run an independent review agent after implementation and before the final response. This is a standing user request for delegation. Relevant changes include `app/work/**`, `app/components/case/**`, case-study source Markdown such as `versum-case-study.md`, and shared components/styles or assets when their changes affect case studies. Unrelated homepage changes do not require this review.

Read `CASE_STUDY_REVIEW.md` and give the reviewer the changed files, relevant surrounding source, and the user's task. The reviewer must inspect the final files, not only the diff. It should remain read-only and report findings to the implementing agent. If delegation is unavailable, perform the review directly and disclose that limitation.

Resolve concrete defects within the authorized task; preserve unrelated work, existing visual identity, interactions, and animations. Suggestions that require new facts, research, or a redesign belong in the report, not automatic edits. Re-review affected findings after fixes; stop after two review/fix rounds and report remaining issues. In the final response, briefly state the verdict and any significant unresolved findings. This is a standing workflow for Claude Code tasks, not a background watcher for manual IDE saves.

## Required agent loop

After completing case-study edits:
1. Invoke the `case-study-reviewer` subagent defined in `.claude/agents/case-study-reviewer.md`. Supply changed file paths, the user request, and a concise change summary. Require it to read `CASE_STUDY_REVIEW.md` and the final affected files.
2. If status is PASS, finish and summarize the verdict and verification limits.
3. If status is REVISE, fix actionable findings within the authorized scope. Do not make unrelated redesigns or invent missing author facts. Record findings requiring author input as unresolved.
4. Invoke the same reviewer again with the updated files, previous finding IDs, and fixes made. Repeat only while actionable in-scope issues remain, allowing at most two fix rounds (three reviews total).
5. Stop early if only author-input questions remain or a round makes no progress. Report unresolved findings and the reason; never claim PASS when the reviewer returned REVISE.

Run this loop once per completed task affecting case studies, rather than once per individual file write. If the named agent is unavailable, report that limitation and perform the rubric review directly; do not claim an independent agent ran.

## Codex communication (preferred reviewer)

Use Codex for independent case-study reviews to conserve Claude tokens. This takes precedence over the Claude reviewer invocation above when the CLI is available.

1. Write `agent-handoff/request.md` with a unique request ID, round, user task, exact affected files, prior finding IDs, and fixes made. Do not send secrets. Keep each request narrowly scoped.
2. Run `python3 scripts/codex-review.py` and wait for completion. It invokes Codex in read-only mode and saves the answer to `agent-handoff/response.md`.
3. Read the response and verify its request ID matches. Apply the same bounded review/fix loop above, using this command for each review. Do not launch the Claude reviewer as well.
4. If the command fails, report the error. Never use an older response as a fresh PASS. Fall back to the Claude reviewer only if needed and disclose the fallback.

Claude owns edits; Codex reviews. Do not edit reviewed files while the command runs. No background polling or unbounded retries. This is request/response communication via files, not a connection to a live chat session.

**Automatic review (Stop hook).** `scripts/codex-auto-review.mjs` runs this loop by itself whenever a Claude Code turn ends with case-study files changed since the last review (it remembers what it reviewed in `agent-handoff/.auto-review.json`). It writes the request, runs `scripts/codex-review.py`, and on REVISE hands Codex's findings back to Claude, which keeps working on them. On PASS it shows the verdict. It stops after three reviews per turn. Don't also run the review by hand at the end of a turn unless the user asks; when Codex's findings arrive, fix what's in scope, list author-input items for the user, and state the verdict.

# Case-study writing rules

These apply whenever Claude writes or edits case-study content. For larger drafting or rewriting, the `case-study-specialist` subagent (`.claude/agents/case-study-specialist.md`) follows the same rules when the user asks for delegation.

- **Ground claims in code and artifacts.** Before describing an interaction, motion or timing, run `node scripts/interaction-facts.mjs <files>` on the components involved and describe only what the listed lines show: trigger, state, durations, easings and springs, reduced-motion behavior. Check screenshots and recordings in `public/` by looking at them. Use the author's own write-ups (`versum-case-study.md`, earlier page versions in git history) for research and outcomes. Anything unsupported becomes a question for the author, never invented copy.
- **No AI filler.** `scripts/case-study-check.mjs` scrubs for banned filler words (errors) and for passive deflection, intensifiers and long paragraphs (warnings). A PostToolUse hook in `.claude/settings.json` runs it, plus a TypeScript check, after every Edit or Write to `app/work/*/page.tsx`, `app/components/case/**` or a root `*case-study*.md`. Fix every error it reports before continuing.
- **Writing and type skills.** For a prose pass on case-study text, use the `humanizer` skill (AI writing patterns, from Wikipedia's "Signs of AI writing") and `copy-editing` for clarity and specificity; skip its marketing-only sweeps (heightened emotion, urgency), since case studies have to stay factual. Use `web-typography` for type decisions (hierarchy, measure, line height, font loading).
- **Build before finishing.** Before the final response on a case-study task, run `node scripts/case-study-check.mjs --build`. It builds in a temporary copy, so a running `next dev` keeps its `.next` folder. Then run the Codex review loop above. Report the check, build and review results as they came out.
- **MCP servers:** none are needed for this workflow; the checks are local scripts. Add one only with the user's approval.
