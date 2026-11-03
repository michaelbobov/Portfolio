# Case-study review

Whenever a Codex task changes case-study content or presentation, run an independent review agent after implementation and before the final response. This is a standing user request for delegation. Relevant changes include `app/work/**`, `app/components/case/**`, case-study source Markdown such as `versum-case-study.md`, and shared components/styles or assets when their changes affect case studies. Unrelated homepage changes do not require this review.

Read `CASE_STUDY_REVIEW.md` and give the reviewer the changed files, relevant surrounding source, and the user's task. The reviewer must inspect the final files, not only the diff. It should remain read-only and report findings to the implementing agent. If delegation is unavailable, perform the review directly and disclose that limitation.

Resolve concrete defects within the authorized task; preserve unrelated work, existing visual identity, interactions, and animations. Suggestions that require new facts, research, or a redesign belong in the report, not automatic edits. Re-review affected findings after fixes; stop after two review/fix rounds and report remaining issues. In the final response, briefly state the verdict and any significant unresolved findings. Do not claim this runs outside Codex or on every IDE save.

## Claude handoff

Claude can request reviews through `agent-handoff/request.md` using `python3 scripts/codex-review.py`. When invoked as that read-only reviewer, return the request ID and findings in your final response; the launcher saves them to `agent-handoff/response.md`. Do not spawn another reviewer or recursively run the launcher. The normal independent-review rule applies to implementation tasks, not review-only tasks. Claude owns implementation while a handoff review runs.
