// The Spotify Loop feature overview: a 1680×720 (21:9) stage on the card's lavender, drawn over a page
// of the site (for its fonts and the screens). A cursor walks through the feature while the camera
// zooms in and out; render(t) is a pure function of time and t = 15 equals t = 0, so it loops.
(() => {
  const W = 1680, H = 720, S = 0.5, BZ = 6;
  const PW = 393 * S + BZ * 2, PH = 852 * S + BZ * 2;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const outC = (x) => 1 - Math.pow(1 - x, 3);
  const inOutC = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const mix = (a, b, x) => a + (b - a) * x;

  const css = `
  #ov { position: fixed; left: 0; top: 0; width: ${W}px; height: ${H}px; overflow: hidden; z-index: 2147483647; background: radial-gradient(70% 80% at 50% 0%, rgba(255,255,255,0.24), transparent 70%), #c4b8ed; font-family: var(--font-geist-sans), system-ui, sans-serif; }
  #ov * { box-sizing: border-box; }
  #ov img { transition: none !important; }
  #ov .world { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; transform-origin: 0 0; }
  #ov .phone { position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px; border-radius: 31px; background: #111014; padding: ${BZ}px; box-shadow: 0 0 0 1px rgba(16, 11, 26, 0.2), 0 30px 60px -24px rgba(40, 20, 80, 0.55); }
  #ov .scr { position: relative; width: ${393 * S}px; height: ${852 * S}px; border-radius: 25px; overflow: hidden; background: #000; }
  #ov .scr > img, #ov .scr > canvas { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
  #ov .row { position: absolute; left: ${10 * S}px; top: ${402 * S}px; width: ${373 * S}px; height: ${70 * S}px; border-radius: 5px; background: #fff; opacity: 0; }
  #ov .cur { position: absolute; left: 0; top: 0; width: 34px; height: 44px; margin: -3px 0 0 -3px; transform-origin: 3px 3px; filter: drop-shadow(0 3px 4px rgba(16, 11, 26, 0.35)); }
  #ov .rip { position: absolute; left: 0; top: 0; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.95); box-shadow: 0 0 0 1px rgba(16, 11, 26, 0.12), inset 0 0 0 1px rgba(16, 11, 26, 0.12); opacity: 0; }
  #ov .chip { position: absolute; left: ${W / 2}px; top: 638px; display: inline-flex; align-items: center; gap: 11px; padding: 12px 20px 12px 16px; border-radius: 999px; background: #fff; color: #1a1030; font-size: 23px; font-weight: 600; letter-spacing: -0.01em; line-height: 1; white-space: nowrap; box-shadow: 0 14px 30px -14px rgba(40, 20, 80, 0.6); opacity: 0; }
  #ov .chip::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: #1ed760; }
  `;
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const root = el('div'); root.id = 'ov';
  const style = el('style'); style.textContent = css;
  document.head.append(style); document.body.append(root);
  const world = root.appendChild(el('div', 'world'));

  const phone = (srcs) => {
    const p = world.appendChild(el('div', 'phone'));
    const s = p.appendChild(el('div', 'scr'));
    const imgs = srcs.map((src) => { const i = el('img'); i.src = src; s.append(i); return i; });
    return { p, s, imgs };
  };
  const LIB = phone(['/Saved%20Loops.png']);
  const row = LIB.s.appendChild(el('div', 'row'));
  const P = phone(['/Loop%20Active.png', '/Loop%20Set.png', '/Loop%20Saved.png']);
  // The timeline, redrawn over the still's own, and the loop button in white (off) until it's clicked
  const bar = document.createElement('canvas'); bar.width = 393 * 3; bar.height = 852 * 3; P.s.append(bar);
  const g = bar.getContext('2d'); g.scale(3, 3);
  const off = document.createElement('canvas'); off.width = 393 * 3; off.height = 852 * 3; P.s.append(off);

  const cur = root.appendChild(el('div', 'cur', '<svg viewBox="0 0 34 44" width="34" height="44"><path d="M4 3v31l8.4-7.6 5.3 12.2 5.6-2.4-5.3-12h11.3Z" fill="#111" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/></svg>'));
  const rip = root.appendChild(el('div', 'rip'));
  const STEPS = [
    ['Turn on loop', 2.0, 2.95],
    ['Drag the start', 2.95, 4.05],
    ['Drag the end', 4.05, 5.4],
    ['Only that part repeats', 5.4, 6.9],
    ['Adjust it anytime', 6.9, 8.25],
    ['Save it', 8.25, 9.9],
    ['Every loop, in your library', 10.4, 12.7],
  ].map(([text, a, b]) => ({ c: root.appendChild(el('div', 'chip', text)), a, b }));

  window.overviewReady = Promise.all([...root.querySelectorAll('img')].map((i) => i.decode())).then(async () => {
    await document.fonts.ready;
    // The loop icon, off: its green pixels turned white, on the bar's brown
    const tmp = document.createElement('canvas'); tmp.width = 393; tmp.height = 852;
    const tg = tmp.getContext('2d'); tg.drawImage(P.imgs[0], 0, 0);
    const box = { x: 62, y: 750, w: 36, h: 36 };
    const d = tg.getImageData(box.x, box.y, box.w, box.h), flat = tg.createImageData(box.w, box.h);
    for (let i = 0; i < d.data.length; i += 4) {
      const r = d.data[i], gg = d.data[i + 1], isG = gg > 120 && gg > r * 1.6;
      flat.data[i] = 0x3f; flat.data[i + 1] = 0x2a; flat.data[i + 2] = 0x05; flat.data[i + 3] = isG ? 255 : 0;
      if (isG) { d.data[i] = d.data[i + 1] = d.data[i + 2] = 255; d.data[i + 3] = Math.round(255 * Math.min(1, (gg - 60) / 160)); } else d.data[i + 3] = 0;
    }
    const ox = off.getContext('2d'); ox.scale(3, 3);
    const a = document.createElement('canvas'); a.width = box.w; a.height = box.h; a.getContext('2d').putImageData(flat, 0, 0);
    const b = document.createElement('canvas'); b.width = box.w; b.height = box.h; b.getContext('2d').putImageData(d, 0, 0);
    ox.drawImage(a, box.x, box.y); ox.drawImage(b, box.x, box.y);
  });

  // ---------- geometry: image px on a phone → world px ----------
  const X0 = 26, X1 = 368, Y = 625, A = 131, B = 269;
  const wpt = (px, py, ix, iy) => [px - PW / 2 + BZ + ix * S, py - PH / 2 + BZ + iy * S];
  const HOME = [840, 360];
  const LOOPB = wpt(...HOME, 80, 767), STA = wpt(...HOME, A, Y), END = wpt(...HOME, B, Y), PLUS = wpt(...HOME, 354, 566);
  // Turning loop on selects the whole track; the start handle is dragged in from X0, then the end from X1
  const S0 = wpt(...HOME, X0, Y), E0 = wpt(...HOME, X1, Y);
  const DRAG_A = [3.1, 3.9], DRAG_B = [4.5, 5.2];
  const ROW = wpt(1040, 360, 196, 437);

  // ---------- the camera ----------
  const CAM = [[0, 840, 360, 1], [1.2, 840, 360, 1], [2.1, 840, 492, 2.1], [2.6, 840, 492, 2.1], [4.8, 848, 474, 2.25], [7.9, 848, 474, 2.25], [8.7, 872, 470, 2.05], [9.9, 872, 470, 2.05], [10.9, 840, 360, 1], [15, 840, 360, 1]];
  const cam = (t) => {
    for (let i = 1; i < CAM.length; i++) {
      const [t1, x1, y1, z1] = CAM[i], [t0, x0, y0, z0] = CAM[i - 1];
      if (t <= t1) {
        const u = inOutC(seg(t, t0, t1));
        return { x: mix(x0, x1, u), y: mix(y0, y1, u), z: Math.exp(mix(Math.log(z0), Math.log(z1), u)) };
      }
    }
    return { x: 840, y: 360, z: 1 };
  };

  // ---------- the cursor: eased moves between world points, with a slight arc ----------
  const CUR = [[0.6, 1790, 860], [2.0, ...LOOPB], [2.5, ...LOOPB], [3.02, ...S0], [3.1, ...S0], [3.9, ...STA], [4.02, ...STA], [4.42, ...E0], [4.5, ...E0], [5.2, ...END], [5.3, ...END], [5.85, 988, 540], [6.45, 988, 540], [7.0, ...END], [7.95, ...END], [8.7, ...PLUS], [10.25, ...PLUS], [11.2, ...ROW], [12.4, ...ROW], [13.4, 1520, 860]];
  const cursorAt = (t) => {
    if (t <= CUR[0][0]) return null;
    for (let i = 1; i < CUR.length; i++) {
      const [t1, x1, y1] = CUR[i], [t0, x0, y0] = CUR[i - 1];
      if (t <= t1) {
        const u = inOutC(seg(t, t0, t1)), dx = x1 - x0, dy = y1 - y0, arc = Math.sin(Math.PI * u) * Math.min(40, Math.hypot(dx, dy) * 0.08);
        const len = Math.hypot(dx, dy) || 1;
        return [mix(x0, x1, u) - (dy / len) * arc, mix(y0, y1, u) + (dx / len) * arc];
      }
    }
    return null;
  };
  const CLICKS = [[2.15, LOOPB], [8.85, PLUS], [11.6, ROW]];

  // ---------- the timeline ----------
  const drawBar = (o) => {
    g.clearRect(0, 0, 393, 852);
    const grd = g.createLinearGradient(0, 610, 0, 640); grd.addColorStop(0, '#5e4007'); grd.addColorStop(1, '#5a3d07');
    g.fillStyle = grd; g.fillRect(18, 612, 360, 26);
    const line = (a, b, c, al = 1) => { if (b <= a || al <= 0) return; g.globalAlpha = al; g.fillStyle = c; g.beginPath(); g.roundRect(a, Y - 2, b - a, 4, 2); g.fill(); g.globalAlpha = 1; };
    line(X0, X1, '#7c643d');
    line(X0, o.dot, 'rgba(255,255,255,0.92)', o.played);
    line(o.a, o.a + (o.b - o.a) * o.green, '#00db4d', o.loop);
    g.fillStyle = '#cbcbcb';
    for (const [x, v] of o.ticks) { if (v <= 0) continue; g.globalAlpha = v * o.loop; g.fillRect(x - 1.1, Y - 7 * v, 2.6, 14 * v); }
    g.globalAlpha = 1;
    g.fillStyle = '#fff'; g.beginPath(); g.arc(o.dot, Y, 6, 0, Math.PI * 2); g.fill();
  };

  window.OVERVIEW_DURATION = 15;
  window.render = (t) => {
    const c = cam(t);
    world.style.transform = `translate(${W / 2}px, ${H / 2}px) scale(${c.z}) translate(${-c.x}px, ${-c.y}px)`;
    const toScreen = ([x, y]) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + H / 2];

    // The phones: the player in the middle; the library slides in beside it, then both go home
    const side = inOutC(seg(t, 9.9, 10.9)) * (1 - inOutC(seg(t, 12.9, 13.9)));
    const px = mix(840, 640, side);
    P.p.style.transform = `translate(${px - PW / 2}px, ${360 - PH / 2}px)`;
    const libIn = outC(seg(t, 9.9, 10.9)), libOut = inOutC(seg(t, 12.8, 13.7));
    LIB.p.style.transform = `translate(${mix(mix(1290, 1040, libIn), 1290, libOut) - PW / 2}px, ${360 - PH / 2}px)`;
    LIB.p.style.opacity = clamp(libIn * 1.5) * (1 - libOut);

    // The player's state, and its reset at the end so the loop starts over seamlessly
    const reset = inOutC(seg(t, 12.9, 13.4));
    const SET = DRAG_B[1];
    P.imgs[1].style.opacity = seg(t, SET, SET + 0.15) * (1 - reset);
    P.imgs[2].style.opacity = seg(t, 8.85, 9.0) * (1 - reset);
    off.style.opacity = Math.max(1 - seg(t, 2.15, 2.3), reset);
    const green = outC(seg(t, 2.15, 2.6));
    const drag = Math.sin(Math.PI * inOutC(seg(t, 7.05, 7.9)));
    // The two handles: on the track's ends as soon as loop is on, then dragged to the part that repeats
    const a = mix(X0, A, inOutC(seg(t, ...DRAG_A))), b = mix(X1, B, inOutC(seg(t, ...DRAG_B))) + 22 * drag;
    let dot;
    if (t >= 13.15) dot = 160 + (t - 15) * 6;
    else if (t < SET) dot = Math.max(a, 160 + t * 6);
    else { const L = b - A, start = Math.max(A, 160 + SET * 6) - A; dot = A + ((start + (t - SET) * 62) % L); }
    const handles = outC(seg(t, 2.3, 2.6));
    drawBar({
      dot, a, b, green, loop: 1 - reset, played: t >= 13.15 ? 1 : 1 - green,
      ticks: [[a, handles], [b, handles]],
    });

    // The library row: highlighted under the cursor, a flash on the click
    row.style.opacity = (0.08 * outC(seg(t, 11.2, 11.4)) + 0.08 * Math.max(0, 1 - Math.abs(t - 11.68) / 0.16)) * (1 - seg(t, 12.45, 12.7));

    // The cursor (in screen space, so it doesn't scale with the zoom) and its clicks
    let cp = cursorAt(t);
    // While dragging, the cursor rides the handle it holds
    if (cp && t > DRAG_A[0] && t < DRAG_A[1]) cp = wpt(...HOME, a, Y);
    if (cp && t > DRAG_B[0] && t < DRAG_B[1]) cp = wpt(...HOME, mix(X1, B, inOutC(seg(t, ...DRAG_B))), Y);
    if (cp && t > 7.05 && t < 7.95) cp = [END[0] + 11 * drag, END[1]];
    if (cp) {
      const [sx, sy] = toScreen(cp);
      let press = 0;
      for (const [tc] of CLICKS) { const u = t - tc; if (u > -0.08 && u < 0.16) press = Math.max(press, u < 0 ? (u + 0.08) / 0.08 : 1 - u / 0.16); }
      // Held down for each drag
      for (const [d0, d1] of [[DRAG_A[0] - 0.05, DRAG_A[1] + 0.05], [DRAG_B[0] - 0.05, DRAG_B[1] + 0.05], [7.0, 7.98]]) {
        if (t > d0 && t < d1) press = Math.max(press, Math.min(seg(t, d0, d0 + 0.08), 1 - seg(t, d1 - 0.08, d1)));
      }
      cur.style.opacity = 1;
      cur.style.transform = `translate(${sx}px, ${sy}px) scale(${1 - 0.14 * press})`;
    } else cur.style.opacity = 0;
    let rv = 0, rp = null;
    for (const [tc, p] of CLICKS) { const u = (t - tc) / 0.55; if (u >= 0 && u < 1) { rv = u; rp = p; } }
    if (rp) {
      const [sx, sy] = toScreen(rp);
      rip.style.opacity = 0.95 * (1 - rv);
      rip.style.transform = `translate(${sx}px, ${sy}px) scale(${mix(0.3, 1.15, outC(rv))})`;
    } else rip.style.opacity = 0;

    // The step under way
    for (const s of STEPS) {
      const i = outC(seg(t, s.a, s.a + 0.32)), o = seg(t, s.b - 0.24, s.b);
      s.c.style.opacity = i * (1 - o);
      s.c.style.transform = `translate(-50%, ${(1 - i) * 14 - o * 8}px) scale(${mix(0.96, 1, i)})`;
    }
  };
})();
