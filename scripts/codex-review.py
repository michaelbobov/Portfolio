#!/usr/bin/env python3
"""Send Claude's handoff to a read-only Codex review and save its reply."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true', help='Check setup without starting a model')
args = parser.parse_args()
exe = os.environ.get('PORTFOLIO_CODEX_BIN') or shutil.which('codex')
if not exe:
    candidates = sorted((Path.home()/'.vscode/extensions').glob('openai.chatgpt-*/bin/*/codex'))
    exe = str(candidates[-1]) if candidates else None
if not exe:
    sys.exit('Codex not found. Put codex on PATH or set PORTFOLIO_CODEX_BIN.')
request = root/'agent-handoff/request.md'
if not request.is_file():
    sys.exit('Missing agent-handoff/request.md')
if args.check:
    print('Ready: Codex found; request and shared rubric available.')
    sys.exit(0)
lock = root/'agent-handoff/.review-lock'
try:
    lock.mkdir()
except FileExistsError:
    sys.exit('A review is already running. If interrupted, remove the empty .review-lock directory before retrying.')
try:
    prompt = ('You are a read-only product design reviewer working with Claude. '
              'Read CASE_STUDY_REVIEW.md and agent-handoff/request.md. Inspect only the requested case studies '
              'and relevant shared files. Do not edit files, delegate, or start another review loop. '
              'Return PASS or REVISE, concrete strengths, findings with stable IDs and file/line references, '
              'specific fixes, author-input questions, and verification limits. Never fabricate facts. '
              'Keep the review under 900 words. Source-only review is acceptable; mark visual quality unverified.')
    with tempfile.TemporaryDirectory(prefix='portfolio-review-') as tmp:
        output = Path(tmp)/'response.md'
        result = subprocess.run([exe, 'exec', '--ephemeral', '--sandbox', 'read-only',
                                 '-C', str(root), '-o', str(output), prompt], cwd=root)
        if result.returncode or not output.is_file() or not output.read_text().strip():
            sys.exit('Codex review failed. Previous response is unchanged; do not treat it as a new result.')
        reply = root/'agent-handoff/response.md'
        pending = reply.with_suffix('.tmp')
        pending.write_text(output.read_text())
        pending.replace(reply)
        print('Review saved to agent-handoff/response.md')
finally:
    lock.rmdir()
