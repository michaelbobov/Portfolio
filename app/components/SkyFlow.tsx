'use client';

import { useEffect, useRef } from 'react';
import { moonPhase, skyBodies } from '@/app/data/sun';

// The homepage's sky as a cinemagraph: the same paintings HomeShell crossfades by the time of day, drawn on
// one WebGL canvas over them, with only the sea of clouds moving. A mask (public/home/cloud-flow.png, made
// from the paintings' layout) marks where the picture may flow; there it drifts slowly sideways and
// billows a little (a flow field of soft noise), while the mountain, the snowdrifts, the twigs and the night
// sky's stars stay still. The drift is a flow map in two phases, each sliding a short way and fading out as
// the other fades in, so it never jumps back. The paintings are placed as the CSS layers under it place them
// (cover, centred at 50% 62%), so the canvas lines up with them exactly and only fades in once it's ready.
// The mask's red is the sea of clouds; its green the open sky, for the high wisps, used only by day; its blue
// the mountain, cut out: nothing moves over it, and the far mist (drawn here, not in CSS) passes behind it.
//
// The sun and the moon are drawn here too, where the sky's time puts them (data/sun.ts: the sun crosses from
// the left and sets behind the mountain's right shoulder; the moon takes the same path by night, lit as it
// really is tonight), behind the mountain and the clouds. Its paintings have the painted sun and moon taken
// out (places.ts, flow).
//
// The time-lapse: while the day is dragged along (HomeShell's boost, signed: forward or back in time), the
// clouds run with it, farther and faster, streaked along their way, backwards when the day is dragged back;
// the sun and moon travel with the hours. Each phase's slide only lengthens or shortens while that phase is
// unseen, so nothing ever snaps back when the drag stops.
// It draws at most 30 frames a second, only while the page is visible; with reduced motion, or without
// WebGL, it isn't used and the still paintings show.
type Props = { scenes: string[]; pair: [number, number, number]; boost?: { current: number }; hours?: { current: number }; lat: number; lon: number };

const VERT = `attribute vec2 p; varying vec2 v; void main() { v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D A, B, M, F;
uniform float k, t, sa, ia, sf, mo, ph, L1, L2, tl;
uniform vec2 sp, mp;
uniform float se, mv, mf;
float h(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 q) { vec2 i = floor(q), f = fract(q); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y); }
vec4 sky(vec2 uv) { return mix(texture2D(A, uv), texture2D(B, uv), k); }
// (a sample far along the flow: mirrored at the painting's sides, and how much of it is cloud or open sky,
// so a long slide never drags the snow, the twigs or the mountain into the clouds)
vec4 tap(vec2 q, inout float val) {
  vec2 m = vec2(1.0 - abs(mod(q.x, 2.0) - 1.0), clamp(q.y, 0.0, 1.0));
  vec4 mm = texture2D(M, m);
  val += max(mm.r, mm.g * sf) * (1.0 - mm.b);
  return sky(m);
}
vec4 slide(vec2 uv, vec2 off, vec2 dir, float spread, out float val) {
  val = 0.0;
  if (spread < 0.002) return tap(uv + off, val);
  // (streaked along its way while it runs fast, as a time-lapse's long exposure)
  vec4 c = tap(uv + off - dir * spread * 0.5, val) + tap(uv + off - dir * spread * 0.17, val)
         + tap(uv + off + dir * spread * 0.17, val) + tap(uv + off + dir * spread * 0.5, val);
  val *= 0.25;
  return c * 0.25;
}
vec3 screen(vec3 a, vec3 b) { return 1.0 - (1.0 - a) * (1.0 - b); }
void main() {
  vec2 s = vec2(v.x, 1.0 - v.y), uv = s;
  if (sa > ia) uv.y = 0.62 + (s.y - 0.62) * (ia / sa); else uv.x = 0.5 + (s.x - 0.5) * (sa / ia);
  vec4 mk = texture2D(M, uv);
  float w = max(mk.r, mk.g * sf);
  vec4 c = sky(uv);
  if (w >= 0.004) {
    // (a time-lapse straightens the flow: less billow, more run)
    vec2 dir = vec2(-1.0, 0.0) + 0.85 * (1.0 - 0.6 * tl) * vec2(n(uv * vec2(5.0, 9.0) + vec2(t * 0.02, 0.0)) - 0.5, n(uv * vec2(5.0, 9.0) + vec2(3.7, t * 0.015)) - 0.5);
    float ph2 = fract(ph + 0.5), sc = w * (mk.r > mk.g * sf ? 1.0 : 0.6);
    float v1, v2;
    vec4 c1 = slide(uv, dir * L1 * sc * ph, dir, L1 * sc * 0.35 * tl, v1);
    vec4 c2 = slide(uv, dir * L2 * sc * ph2, dir, L2 * sc * 0.35 * tl, v2);
    float b = abs(1.0 - 2.0 * ph), vs = (1.0 - b) * v1 + b * v2;
    vec4 cf = (c1 * (1.0 - b) * v1 + c2 * b * v2) / max(vs, 0.001);
    c = mix(c, cf, smoothstep(0.1, 0.5, vs));
  }
  // what stands in front of the sun and the moon: the mountain and its cloud band (blue), the sea of clouds (red)
  float open = (1.0 - mk.b) * (1.0 - mk.r);
  // the sun: a white-hot disc (pale yellow low down) in a glare that's warm by day and orange as it gets low,
  // the glow lingering a while after it has set
  float lo = 1.0 - smoothstep(0.0, 16.0, se);
  vec3 core = mix(vec3(1.0, 1.0, 0.97), vec3(1.0, 0.95, 0.74), lo);
  vec3 haze = mix(vec3(1.0, 0.93, 0.78), vec3(1.0, 0.62, 0.28), lo);
  float ds = length((uv - sp) * vec2(ia, 1.0));
  float up = smoothstep(-6.0, 0.5, se);
  float glare = (1.0 * exp(-ds / 0.02) + 0.5 * exp(-ds / 0.075) + 0.22 * exp(-ds / 0.3)) * up * (0.4 + 0.6 * open);
  c.rgb = screen(c.rgb, haze * glare);
  c.rgb = mix(c.rgb, core, smoothstep(0.022, 0.0165, ds) * open * smoothstep(-1.2, 0.0, se));
  // the moon, lit as it is tonight (waxing from the right), its dark part faintly there, and a cool halo
  if (mv > 0.001) {
    float dm = length((uv - mp) * vec2(ia, 1.0)), r = 0.019;
    vec2 q = (uv - mp) * vec2(ia, 1.0) / r;
    float tt = cos(6.2832 * mf) * sqrt(max(0.0, 1.0 - q.y * q.y));
    float lit = mf < 0.5 ? smoothstep(tt - 0.1, tt + 0.1, q.x) : smoothstep(-tt + 0.1, -tt - 0.1, q.x);
    float full = 0.5 - 0.5 * cos(6.2832 * mf);
    float halo = (0.42 * exp(-dm / 0.022) + 0.16 * exp(-dm / 0.12)) * (0.35 + 0.65 * full) * mv * open;
    c.rgb = screen(c.rgb, vec3(0.72, 0.8, 0.95) * halo);
    vec3 face = vec3(0.99, 0.98, 0.93) * (0.86 + 0.14 * n(q * 2.6 + 4.0));
    c.rgb = mix(c.rgb, mix(c.rgb + vec3(0.03, 0.04, 0.06), face, lit), smoothstep(1.0, 0.9, dm / r) * mv * open);
  }
  // the far mist, drifting across the screen (as the CSS layer did: one screen-wide tile, 170 s a lap),
  // screened over the sky but held back by the mountain (mask blue), so it passes behind the peak
  float band = s.y - 0.52;
  float mist = 0.0;
  if (band > 0.0 && band < 0.15) mist = texture2D(F, vec2(fract(s.x + t / 170.0), band / 0.15)).r * mo * (1.0 - mk.b);
  gl_FragColor = vec4(screen(c.rgb, vec3(mist)), 1.0);
}`;

export default function SkyFlow({ scenes, pair, boost, hours, lat, lon }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const live = useRef(pair);
  live.current = pair;
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = c.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const sh = (type: number, src: string) => { const o = gl.createShader(type)!; gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    gl.uniform1i(u('A'), 0); gl.uniform1i(u('B'), 1); gl.uniform1i(u('M'), 2); gl.uniform1i(u('F'), 3);
    // the paintings and the mask, as textures, once each has loaded
    const tex: (WebGLTexture | null)[] = [];
    let ready = 0, aspect = 1.5, cancelled = false;
    const load = (src: string, i: number, done: () => void) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        const t = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + Math.min(i, 3));
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // (the mist's texture wraps sideways, as it drifts round; WebGL 1 repeats only powers of two, so the
        // shader wraps it with fract() instead and every texture clamps)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        if (i < scenes.length) aspect = img.naturalWidth / img.naturalHeight;
        tex[i] = t;
        done();
      };
      img.src = src;
    };
    const all = [...scenes, '/home/cloud-flow.png', '/home/wisps.webp'];
    all.forEach((src, i) => load(src, i, () => { ready += 1; }));
    // The clocks. `clock` runs the billow and the far mist, faster while the day is dragged (and backwards when
    // it's dragged back); `phase` runs the two slides. How far each slide goes (L1, L2) grows with the
    // time-lapse, but only changes while its phase is unseen (at its own restart), so it never snaps back.
    let W = 0, H = 0, raf = 0, last = 0, shown = false, clock = 0, phase = 0, tl = 0, L1 = 0.055, L2 = 0.055;
    const size = () => {
      // (soft paintings: drawn at the screen's own pixels at most, never more)
      const d = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.round(c.clientWidth * d); H = Math.round(c.clientHeight * d);
      c.width = W; c.height = H; gl.viewport(0, 0, W, H);
    };
    size();
    let moonAt = 0, mf = 0.5;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 33) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      const lift = boost ? boost.current : 0;
      if (boost) boost.current = lift * Math.pow(0.12, dt);
      tl += (Math.min(1, Math.abs(lift) / 7) - tl) * Math.min(1, dt * 5);
      const way = lift < 0 ? -1 : 1;
      clock += dt * (1 + lift);
      phase += dt * 0.24 * (1 + 3 * tl) * (lift < -1 ? way : 1);
      phase -= Math.floor(phase);
      const want = 0.055 * (1 + 3.5 * tl), b = Math.abs(1 - 2 * phase);
      if (b > 0.88) L1 = want;
      if (b < 0.12) L2 = want;
      if (ready < all.length) return;
      const [a, bb, k] = live.current;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[a]);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex[bb]);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, tex[all.length - 2]);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, tex[all.length - 1]);
      gl.uniform1f(u('k'), k); gl.uniform1f(u('t'), clock);
      gl.uniform1f(u('ph'), phase); gl.uniform1f(u('L1'), L1); gl.uniform1f(u('L2'), L2); gl.uniform1f(u('tl'), tl);
      // (the high wisps move by day and settle toward night, so the stars and moon stay still)
      gl.uniform1f(u('sf'), Math.max(0, Math.min(1, 2.5 - (a + k))));
      // (the far mist: half strength by day, a little less at night, moonlit)
      gl.uniform1f(u('mo'), 0.5 - 0.12 * Math.max(0, Math.min(1, a + k - 2)));
      gl.uniform1f(u('sa'), W / H); gl.uniform1f(u('ia'), aspect);
      // the sun and the moon, where the sky's time (now, or the hour dragged to) puts them; the moon only
      // once the sky is dark, its phase looked up once a minute
      const when = new Date(Date.now() + (hours ? hours.current : 0) * 3600000);
      const bodies = skyBodies(when, lat, lon);
      if (now - moonAt > 60000 || Math.abs(when.getTime() - Date.now()) > 3600000) { mf = moonPhase(when); moonAt = now; }
      gl.uniform2f(u('sp'), bodies.sun.x, bodies.sun.y);
      gl.uniform1f(u('se'), bodies.elevation);
      gl.uniform2f(u('mp'), bodies.moon.x, bodies.moon.y);
      // (a thin crescent at least, so there's a moon to see on the darkest nights)
      gl.uniform1f(u('mf'), Math.min(0.93, Math.max(0.07, mf)));
      gl.uniform1f(u('mv'), Math.max(0, Math.min(1, (a + k - 1.7) / 0.9)));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!shown) { shown = true; c.classList.add('is-on'); }
    };
    const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(draw); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    start();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', vis);
    return () => { cancelled = true; stop(); ro.disconnect(); document.removeEventListener('visibilitychange', vis); };
    // (the scenes are fixed for the page; the pair and blend are read live from the ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <canvas ref={ref} className="hm-skyflow" aria-hidden="true" />;
}
