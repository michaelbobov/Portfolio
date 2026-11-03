#!/usr/bin/env node
// Lists the interaction facts in components, with file:line, so a case study describes what the code
// does rather than what it sounds like it does: state, event handlers, Framer Motion props, timings,
// easings and springs, observers and animation frames, reduced-motion handling, and CSS transitions
// and keyframes. Pass files or folders (.tsx, .ts, .jsx, .js, .css):
//
//   node scripts/interaction-facts.mjs app/components/DollScene.ts app/hp.css
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const EXT = new Set(['.tsx', '.ts', '.jsx', '.js', '.css']);
const RULES = [
  ['state', /\buse(State|Reducer|Ref|MotionValue|Spring|Transform|Scroll|InView|AnimationControls|Animate)\b\s*[<(]/],
  ['event', /\bon[A-Z][A-Za-z]+\s*=|\baddEventListener\(\s*['"][a-z]+['"]/],
  ['framer-motion', /\bmotion\.[a-z]+|\b(initial|animate|exit|whileHover|whileTap|whileInView|whileDrag|drag|layout|layoutId|variants)\s*=|<(AnimatePresence|MotionConfig|LayoutGroup)\b/],
  ['timing', /\b(duration|delay|stagger(Children)?|repeat|setTimeout|setInterval)\b\s*[:=(]|\b\d+(\.\d+)?m?s\b/],
  ['easing / spring', /\b(ease|easing|stiffness|damping|mass|bounce|velocity|cubic-bezier|spring|tween)\b/],
  ['frame / observer', /\b(requestAnimationFrame|IntersectionObserver|ResizeObserver|MutationObserver)\b/],
  ['reduced motion', /prefers-reduced-motion|reducedMotion|matchMedia\(/],
  ['css motion', /\b(transition|animation)\s*:|@keyframes\b|\btransform\s*:|\bscale\s*:|\btranslate\s*:/],
  ['tuning constant', /^\s*(export\s+)?const\s+[A-Z][A-Z0-9_]{2,}\s*=\s*[-\d{[(]/],
];

const files = [];
const walk = (p) => {
  const s = statSync(p);
  if (s.isDirectory()) for (const e of readdirSync(p)) { if (e !== 'node_modules' && !e.startsWith('.')) walk(join(p, e)); }
  else if (EXT.has(extname(p))) files.push(p);
};
const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('Usage: node scripts/interaction-facts.mjs <file or folder> […]');
  process.exit(1);
}
targets.forEach((t) => walk(resolve(t)));

for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  const byRule = new Map();
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    for (const [rule, re] of RULES) {
      if (re.test(line)) {
        if (!byRule.has(rule)) byRule.set(rule, []);
        byRule.get(rule).push(`${i + 1}: ${line.trim().slice(0, 140)}`);
      }
    }
  });
  if (!byRule.size) continue;
  console.log(`\n## ${relative(root, f)}`);
  for (const [rule, hits] of byRule) {
    console.log(`  ${rule} (${hits.length})`);
    hits.slice(0, 40).forEach((h) => console.log(`    ${h}`));
    if (hits.length > 40) console.log(`    … ${hits.length - 40} more`);
  }
}
