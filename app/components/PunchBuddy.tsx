'use client';

import { useEffect, useRef } from 'react';

// "Punch me!": a grape cartoon character for the hero (ported from the hit-me prototype). Its eyes
// follow the pointer and it blinks now and then. On fine pointers a boxing-glove cursor trails the
// pointer, aims at it and lunges on press. Each hit squashes it, leans it away from the punch,
// flashes > < eyes, and throws a coloured POW, stars, confetti and impact rays; four quick hits make
// it dizzy. Then it answers with a real fact in a speech or thought bubble (the résumé after the
// last one). Phones: tap to punch, bubbles stack under it, no glove. Keyboard: Enter / Space.
// Everything runs on refs, rAF and Web Animations; React never re-renders per frame, and every
// timer, listener, frame and FX node is cleaned up on unmount.

const FACTS = [
  'I co-founded Versum Health.',
  'I take products from research to shipped code.',
  'Versum connects uninsured patients with supervised dental students.',
  'EZ Recipe has generated 400+ recipes.',
  'EZ Recipe cooks with what’s already in your kitchen.',
  'PDF Penguin turns messy PDFs into clean JSON.',
  'I designed native song-section looping for Spotify. Unofficially.',
  'I design it, then I build it.',
  'Based in Seattle.',
];
const RESUME = '/Michael Bobov - Product Designer.pdf';
const WORDS = ['POW!', 'BAM!', 'WHAM!', 'BOP!', 'ZAP!', 'KAPOW!'];
const COLORS = ['#ffd84d', '#ff8fb8', '#7ce0b3', '#7cc8ff', '#ffa45c', '#c9b6ff'];
const INK = '#1d1233';
const STAR = 'M12 1l3.2 6.9 7.3.8-5.4 5 1.5 7.3L12 17.3 5.4 21l1.5-7.3-5.4-5 7.3-.8Z';
// Where desktop bubbles sit around the character (% of the stage), and which way each tail points
const SLOTS = [
  { x: -10, y: 2, t: 'br' }, { x: 60, y: -2, t: 'bl' }, { x: 64, y: 74, t: 'tl' },
  { x: -8, y: 76, t: 'tr' }, { x: 70, y: 44, t: 'l' }, { x: -18, y: 40, t: 'r' },
] as const;
const TAIL: Record<string, [string, string, string, string, string]> = {
  br: ['calc(100% - 48px)', 'calc(100% - 9px)', '45deg', '85%', '100%'],
  bl: ['30px', 'calc(100% - 9px)', '45deg', '15%', '100%'],
  tl: ['30px', '-12px', '225deg', '15%', '0%'],
  tr: ['calc(100% - 48px)', '-12px', '225deg', '85%', '0%'],
  l: ['-12px', 'calc(50% - 10px)', '135deg', '0%', '50%'],
  r: ['calc(100% - 8px)', 'calc(50% - 10px)', '-45deg', '100%', '50%'],
};
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

export default function PunchBuddy() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const buddyRef = useRef<HTMLButtonElement | null>(null);
  const bodyRef = useRef<SVGGElement | null>(null);
  const saidRef = useRef<HTMLParagraphElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const gloveRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const stage = stageRef.current, buddy = buddyRef.current, bodyg = bodyRef.current;
    const said = saidRef.current, mlist = listRef.current, glove = gloveRef.current;
    if (!stage || !buddy || !bodyg || !said || !mlist || !glove) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 899px)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    // ---------- bookkeeping, so unmount leaves nothing behind ----------
    let alive = true;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms);
      timers.add(id);
      return id;
    };
    const frames = new Set<number>();
    const frame = (fn: FrameRequestCallback) => {
      const id = requestAnimationFrame((t) => { frames.delete(id); if (alive) fn(t); });
      frames.add(id);
      return id;
    };
    const fx = new Set<Element>();
    const addFx = <E extends Element>(el: E) => { document.body.appendChild(el); fx.add(el); return el; };
    const dropFx = (el: Element) => { el.remove(); fx.delete(el); };
    const off: Array<() => void> = [];
    const listen = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      off.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    // ---------- eyes follow the pointer, and it blinks now and then ----------
    const pupils = Array.from(buddy.querySelectorAll<SVGCircleElement>('.pupil'));
    const home = pupils.map((p) => [Number(p.getAttribute('cx')), Number(p.getAttribute('cy'))]);
    const look = (x: number, y: number) => {
      const r = buddy.getBoundingClientRect(), sx = r.width / 240;
      pupils.forEach((p, i) => {
        const ex = r.left + home[i][0] * sx, ey = r.top + home[i][1] * sx;
        const a = Math.atan2(y - ey, x - ex), d = Math.min(7, Math.hypot(x - ex, y - ey) / 30);
        p.setAttribute('transform', `translate(${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)})`);
      });
    };
    const blink = () => {
      if (!reduce.matches) {
        buddy.classList.add('blink');
        later(() => buddy.classList.remove('blink'), 140);
      }
      later(blink, 2600 + Math.random() * 3800);
    };
    later(blink, 2200);

    // ---------- glove cursor: trails the pointer, tilts with speed, aims at the character ----------
    let gx = -100, gy = -100, tx = -100, ty = -100, gl = 0, over = false, punching = 0;
    const gloveTick = () => {
      gl = 0;
      const k = reduce.matches ? 1 : 0.4;
      const nx = gx + (tx - gx) * k, vx = nx - gx;
      gx = nx; gy += (ty - gy) * k;
      const r = buddy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const aim = (Math.atan2(cy - gy, cx - gx) * 180) / Math.PI + 90;
      const p = punching ? Math.sin(Math.min(1, (performance.now() - punching) / 160) * Math.PI) : 0;
      if (punching && performance.now() - punching > 160) punching = 0;
      const lunge = reduce.matches ? 0 : p * 16, ang = (aim * Math.PI) / 180 - Math.PI / 2;
      glove.style.transform = `translate3d(${(gx + Math.cos(ang) * lunge).toFixed(1)}px, ${(gy + Math.sin(ang) * lunge).toFixed(1)}px, 0) rotate(${(aim + Math.max(-20, Math.min(20, vx * 1.5))).toFixed(1)}deg) scale(${(1 - p * 0.18).toFixed(3)})`;
      if (over || punching || Math.abs(tx - gx) > 0.5) gl = frame(gloveTick);
    };
    listen(window, 'pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!narrow.matches) look(e.clientX, e.clientY);
      if (over && !gl) gl = frame(gloveTick);
    }, { passive: true });
    listen(stage, 'pointerenter', (e) => {
      if (!fine.matches || e.pointerType !== 'mouse') return;
      over = true; gx = tx = e.clientX; gy = ty = e.clientY;
      stage.classList.add('gloved'); glove.classList.add('on');
      if (!gl) gl = frame(gloveTick);
    });
    listen(stage, 'pointerleave', () => { over = false; stage.classList.remove('gloved'); glove.classList.remove('on'); });

    // ---------- impact ----------
    let squash: Animation | null = null;
    let hurtT = 0;
    const star = (x: number, y: number) => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 24 24');
      s.setAttribute('class', 'pb-star');
      s.innerHTML = `<path d="${STAR}" fill="${pick(COLORS)}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      addFx(s);
      const vx = (Math.random() - 0.5) * 9, vr = (Math.random() - 0.5) * 30, t0 = performance.now();
      let vy = -4 - Math.random() * 6, px = x, py = y, rot = 0;
      const step = () => {
        const t = performance.now() - t0;
        vy += 0.45; px += vx; py += vy; rot += vr;
        s.style.transform = `translate3d(${px - 11}px, ${py - 11}px, 0) rotate(${rot}deg) scale(${Math.max(0, 1 - t / 760)})`;
        if (t < 760) frame(step); else dropFx(s);
      };
      frame(step);
    };
    const bit = (x: number, y: number) => {
      const d = addFx(document.createElement('div'));
      d.className = 'pb-bit';
      const sz = 7 + Math.random() * 7, round = Math.random() < 0.4;
      Object.assign(d.style, { width: `${sz}px`, height: `${round ? sz : sz * 0.55}px`, borderRadius: round ? '50%' : '2px', background: pick(COLORS) });
      let vx = (Math.random() - 0.5) * 12, vy = -3 - Math.random() * 8, px = x, py = y, rot = Math.random() * 360;
      const vr = (Math.random() - 0.5) * 24, t0 = performance.now();
      const step = () => {
        const t = performance.now() - t0;
        vy += 0.38; vx *= 0.985; px += vx; py += vy; rot += vr;
        d.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${rot}deg)`;
        d.style.opacity = String(Math.max(0, 1 - t / 900));
        if (t < 900) frame(step); else dropFx(d);
      };
      frame(step);
    };
    const rays = (x: number, y: number) => {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * 360 + Math.random() * 20;
        const r = addFx(document.createElement('div'));
        r.className = 'pb-ray';
        r.animate([
          { transform: `translate3d(${x}px, ${y}px, 0) rotate(${a}deg) translateX(30px) scaleX(0.2)`, opacity: 1 },
          { transform: `translate3d(${x}px, ${y}px, 0) rotate(${a}deg) translateX(58px) scaleX(1)`, opacity: 0 },
        ], { duration: 320, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).onfinish = () => dropFx(r);
      }
    };
    // A quick flurry of punches makes it dizzy: stars orbit its head for a moment
    const recent: number[] = [];
    let dizzyEl: HTMLDivElement | null = null;
    const flurry = () => {
      const now = performance.now();
      recent.push(now);
      while (recent.length && now - recent[0] > 1500) recent.shift();
      if (recent.length < 4 || dizzyEl) return;
      const el = document.createElement('div');
      el.className = 'pb-dizzy';
      const spans = [0, 1, 2].map((i) => {
        const sp = document.createElement('span');
        sp.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="${STAR}" fill="${COLORS[i * 2]}" stroke="${INK}" stroke-width="2"/></svg>`;
        el.appendChild(sp);
        return sp;
      });
      stage.appendChild(el);
      dizzyEl = el;
      const t0 = performance.now();
      const spin = () => {
        const t = (performance.now() - t0) / 1000;
        spans.forEach((sp, i) => {
          const a = t * 6 + i * 2.094;
          sp.style.transform = `translate(${Math.cos(a) * 64}px, ${Math.sin(a) * 14}px) scale(${0.85 + Math.sin(a) * 0.2})`;
          sp.style.zIndex = Math.sin(a) > 0 ? '5' : '1';
        });
        if (t < 1.4) frame(spin);
        else { el.remove(); dizzyEl = null; recent.length = 0; }
      };
      frame(spin);
    };
    // The POW lands somewhere random on the side of the character away from the glove (or around
    // its head without a glove), never on the glove, and always above the glove's layer.
    const placeWord = (w: HTMLElement, px: number, py: number, withGlove: boolean) => {
      const r = buddy.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
      const hw = w.offsetWidth / 2, hh = w.offsetHeight / 2;
      const s = stage.getBoundingClientRect();
      const vw = document.documentElement.clientWidth, vh = window.innerHeight;
      const minX = Math.max(0, s.left - 60) + hw + 8, maxX = Math.min(vw, s.right + 60) - hw - 8;
      const minY = Math.max(hh + 8, s.top - 40 + hh), maxY = vh - hh - 8;
      const away = withGlove ? Math.atan2(cy - py, cx - px) : -Math.PI / 2;
      const ring = Math.max(r.width, r.height) * 0.5;
      let bx = cx, by = r.top - hh, bestGap = -Infinity;
      for (let i = 0; i < 12; i++) {
        const a = away + (Math.random() - 0.5) * Math.PI * 0.95;
        const reach = ring + Math.max(hw, hh) * (0.55 + Math.random() * 0.55);
        const x = Math.min(maxX, Math.max(minX, cx + Math.cos(a) * reach));
        const y = Math.min(maxY, Math.max(minY, cy + Math.sin(a) * reach * 0.9));
        const gap = withGlove ? Math.hypot(x - px, y - py) - (Math.max(hw, hh) + 90) : Infinity;
        if (gap > bestGap) { bx = x; by = y; bestGap = gap; }
        if (gap > 0) break;
      }
      w.style.left = `${(bx - hw).toFixed(0)}px`;
      w.style.top = `${(by - hh).toFixed(0)}px`;
      w.style.setProperty('--rot', `${(Math.random() * 30 - 15).toFixed(1)}deg`);
      w.style.setProperty('--sc', (0.85 + Math.random() * 0.35).toFixed(2));
    };
    const hitFx = (px: number, py: number, fromX: number, withGlove: boolean) => {
      buddy.classList.add('hurt');
      window.clearTimeout(hurtT);
      timers.delete(hurtT);
      hurtT = later(() => buddy.classList.remove('hurt'), 380);
      if (reduce.matches) return;
      const lean = fromX < 0 ? 9 : -9;
      squash?.cancel();
      squash = bodyg.animate([
        { transform: 'scale(1,1) rotate(0deg)' },
        { transform: `scale(1.16,0.82) rotate(${lean}deg)`, offset: 0.18 },
        { transform: `scale(0.92,1.1) rotate(${-lean * 0.5}deg)`, offset: 0.45 },
        { transform: `scale(1.04,0.97) rotate(${lean * 0.2}deg)`, offset: 0.7 },
        { transform: 'scale(1,1) rotate(0deg)' },
      ], { duration: 620, easing: 'ease-out' });
      stage.classList.remove('shake');
      void stage.offsetWidth;
      stage.classList.add('shake');
      const w = addFx(document.createElement('div'));
      w.className = 'pb-boom';
      w.textContent = pick(WORDS);
      w.style.setProperty('--bc', pick(COLORS));
      placeWord(w, px, py, withGlove);
      later(() => dropFx(w), 600);
      for (let i = 0; i < 7; i++) star(px, py);
      for (let i = 0; i < 10; i++) bit(px, py);
      rays(px, py);
      flurry();
    };

    // ---------- speech and thought bubbles ----------
    let order: number[] = [], slot = 0, shown = 0, cIdx = 0;
    const live: HTMLElement[] = [];
    const nextFact = () => {
      if (!order.length) order = FACTS.map((_, i) => i).sort(() => Math.random() - 0.5);
      return FACTS[order.pop() as number];
    };
    const retire = (b: Element) => { b.classList.add('out'); later(() => b.remove(), 220); };
    const speak = () => {
      shown++;
      const b = document.createElement('div');
      b.className = 'pb-bubble';
      if (shown === FACTS.length + 1) {
        b.append('Okay, okay! That’s everything. ');
        const a = document.createElement('a');
        a.href = RESUME;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Here’s my résumé';
        b.append(a, '.');
        said.textContent = 'Okay, okay! That’s everything. Here’s my résumé.';
      } else {
        const t = nextFact();
        b.textContent = t;
        said.textContent = t;
      }
      const r = Math.random() * 10 - 5;
      b.style.setProperty('--r', `${r.toFixed(1)}deg`);
      b.style.setProperty('--r0', `${(r * 3).toFixed(1)}deg`);
      b.style.setProperty('--bc', COLORS[cIdx++ % COLORS.length]);
      const think = !narrow.matches && shown % 3 === 0;
      if (think) b.classList.add('think');
      if (narrow.matches) {
        b.style.setProperty('--ox', '15%');
        b.style.setProperty('--oy', '0%');
        mlist.prepend(b);
        while (mlist.children.length > 3) retire(mlist.lastElementChild as Element);
        return;
      }
      const s = SLOTS[slot++ % SLOTS.length];
      const [tailX, tailY, tailR, ox, oy] = TAIL[s.t];
      Object.assign(b.style, { left: `${s.x}%`, top: `${s.y}%` });
      b.style.setProperty('--tx', tailX);
      b.style.setProperty('--ty', tailY);
      b.style.setProperty('--tr', tailR);
      b.style.setProperty('--ox', ox);
      b.style.setProperty('--oy', oy);
      if (think) {
        // Thought-bubble circles trail toward the character instead of a pointed tail
        const down = oy === '100%', up = oy === '0%', left = ox !== '85%' && ox !== '100%';
        const c1 = down ? [`calc(${ox} - 8px)`, 'calc(100% + 6px)'] : up ? [`calc(${ox} - 8px)`, '-24px'] : left ? ['-24px', 'calc(50% - 8px)'] : ['calc(100% + 6px)', 'calc(50% - 8px)'];
        const c2 = down ? [`calc(${ox} - 18px)`, 'calc(100% + 24px)'] : up ? [`calc(${ox} - 18px)`, '-40px'] : left ? ['-40px', 'calc(50% + 6px)'] : ['calc(100% + 24px)', 'calc(50% + 6px)'];
        b.style.setProperty('--cx1', c1[0]);
        b.style.setProperty('--cy1', c1[1]);
        b.style.setProperty('--cx2', c2[0]);
        b.style.setProperty('--cy2', c2[1]);
      }
      stage.appendChild(b);
      // Keep it inside the page: nudge a bubble that would run past either edge of the viewport.
      // Measured from layout (offsetLeft/Width), since the pop-in scale would skew a client rect.
      const left = stage.getBoundingClientRect().left + b.offsetLeft;
      const right = left + b.offsetWidth;
      const vw = document.documentElement.clientWidth;
      if (right > vw - 16) b.style.left = `${b.offsetLeft - (right - (vw - 16))}px`;
      else if (left < 16) b.style.left = `${b.offsetLeft + (16 - left)}px`;
      live.push(b);
      while (live.length > 4) retire(live.shift() as HTMLElement);
    };

    listen(buddy, 'pointerdown', () => {
      if (fine.matches && over) punching = performance.now();
      if (!gl && over) gl = frame(gloveTick);
    });
    listen(buddy, 'click', (e) => {
      const r = buddy.getBoundingClientRect();
      const px = e.clientX || r.left + r.width / 2, py = e.clientY || r.top + r.height * 0.35;
      hitFx(px, py, px - (r.left + r.width / 2), over && fine.matches && e.clientX !== 0);
      later(speak, reduce.matches ? 0 : 140);
    });

    return () => {
      alive = false;
      off.forEach((fn) => fn());
      timers.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => cancelAnimationFrame(id));
      fx.forEach((el) => el.remove());
      squash?.cancel();
      dizzyEl?.remove();
      stage.classList.remove('gloved', 'shake');
      buddy.classList.remove('hurt', 'blink');
    };
  }, []);

  return (
    <>
      <div className="pb-stage" ref={stageRef}>
        <div className="pb-halftone" aria-hidden="true" />
        {/* What he does and where, slapped on the stage like a sticker */}
        <p className="pb-tag">PRODUCT DESIGNER · SEATTLE</p>
        <button
          ref={buddyRef}
          className="pb-buddy"
          type="button"
          aria-label="Punch me to hear what Michael does"
          aria-describedby="pb-said"
        >
          <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
            <ellipse className="pb-shadow" cx="120" cy="228" rx="78" ry="9" opacity="0.18" style={{ fill: 'var(--wf-ink)' }} />
            <g className="pb-body" ref={bodyRef}>
              <path d="M120 24c62 0 98 34 98 98 0 66-36 100-98 100S22 188 22 122 58 24 120 24Z" strokeWidth="6" style={{ fill: 'var(--wf-accent)', stroke: 'var(--wf-ink)' }} />
              <path d="M62 66c12-16 30-24 50-26" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="62" cy="142" rx="14" ry="8" opacity=".75" style={{ fill: 'var(--wf-cheek)' }} />
              <ellipse cx="178" cy="142" rx="14" ry="8" opacity=".75" style={{ fill: 'var(--wf-cheek)' }} />
              <g className="pb-face-ok">
                <g>
                  <ellipse cx="90" cy="108" rx="19" ry="23" fill="#fff" strokeWidth="5" style={{ stroke: 'var(--wf-ink)' }} />
                  <circle className="pupil" cx="90" cy="110" r="9" style={{ fill: 'var(--wf-ink)' }} />
                  <rect className="pb-lid" x="70" y="84" width="40" height="48" rx="20" strokeWidth="5" style={{ fill: 'var(--wf-accent)', stroke: 'var(--wf-ink)' }} />
                </g>
                <g>
                  <ellipse cx="150" cy="108" rx="19" ry="23" fill="#fff" strokeWidth="5" style={{ stroke: 'var(--wf-ink)' }} />
                  <circle className="pupil" cx="150" cy="110" r="9" style={{ fill: 'var(--wf-ink)' }} />
                  <rect className="pb-lid" x="130" y="84" width="40" height="48" rx="20" strokeWidth="5" style={{ fill: 'var(--wf-accent)', stroke: 'var(--wf-ink)' }} />
                </g>
                <path d="M100 152c10 12 30 12 40 0" fill="none" strokeWidth="6" strokeLinecap="round" style={{ stroke: 'var(--wf-ink)' }} />
              </g>
              <g className="pb-face-hit" fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--wf-ink)' }}>
                <path d="M76 96l20 12-20 12" />
                <path d="M164 96l-20 12 20 12" />
                <ellipse cx="120" cy="158" rx="13" ry="16" stroke="none" style={{ fill: 'var(--wf-ink)' }} />
              </g>
              <text x="120" y="204" textAnchor="middle" fontWeight="800" fontSize="20" fill="#fff" opacity=".9" letterSpacing="1" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>MB</text>
            </g>
          </svg>
          <span className="pb-label" aria-hidden="true">Punch me!</span>
        </button>
        <div className="pb-list" ref={listRef} />
        <p className="sr-only" id="pb-said" ref={saidRef} aria-live="polite" />
      </div>
      {/* The glove cursor sits outside the stage, so the stage's shake never moves its fixed frame */}
      <div className="pb-glove" ref={gloveRef} aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <g className="pb-fist">
            <path d="M20 44c-8-2-13-9-13-18C7 14 15 6 29 6h6c13 0 22 8 22 20 0 10-6 17-15 19Z" strokeWidth="3" strokeLinejoin="round" style={{ fill: 'var(--wf-glove)', stroke: 'var(--wf-ink)' }} />
            <path d="M13 30c-5 1-8 5-6 10 2 4 7 5 11 2" strokeWidth="3" strokeLinejoin="round" style={{ fill: 'var(--wf-glove)', stroke: 'var(--wf-ink)' }} />
            <path d="M24 12c4-2 9-3 14-2" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
            <rect x="19" y="43" width="25" height="15" rx="4" fill="#fff" strokeWidth="3" style={{ stroke: 'var(--wf-ink)' }} />
            <path d="M23 48h17M23 53h17" strokeWidth="2" style={{ stroke: 'var(--wf-ink)' }} />
          </g>
        </svg>
      </div>
    </>
  );
}
