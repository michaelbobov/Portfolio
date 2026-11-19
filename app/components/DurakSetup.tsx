'use client';

import { useEffect, useRef, useState } from 'react';
import { COLORS, DollAvatar, colorOf, type Look } from '@/app/components/DurakDoll';

// "Make your doll", before a game of Durak: pick a colour, and (if they like) take a photo with the camera,
// which goes in the doll's face window, live while the camera's on. The photo stays in this tab: it's
// drawn to a canvas and kept as a small image in memory, never uploaded.

type Cam = 'off' | 'asking' | 'live' | 'denied';

export default function DurakSetup({ look, onChange, players, onPlayers, onHelp, onDone, cta }: { look: Look; onChange: (l: Look) => void; cta: string; players: number; onPlayers: (n: number) => void; onHelp: () => void; onDone: () => void }) {
  const video = useRef<HTMLVideoElement | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const [cam, setCam] = useState<Cam>('off');

  const stop = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; };
  // (the camera goes off whenever this screen does)
  useEffect(() => stop, []);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setCam('denied'); return; }
    setCam('asking');
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } }, audio: false });
      setCam('live');
    } catch { setCam('denied'); }
  };
  useEffect(() => {
    const v = video.current;
    if (cam === 'live' && v && stream.current) { v.srcObject = stream.current; v.play().catch(() => {}); }
  }, [cam]);

  const snap = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const n = Math.min(v.videoWidth, v.videoHeight), size = 320;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d') as CanvasRenderingContext2D;
    // (mirrored, the way they saw it)
    x.translate(size, 0); x.scale(-1, 1);
    x.drawImage(v, (v.videoWidth - n) / 2, (v.videoHeight - n) / 2, n, n, 0, 0, size, size);
    onChange({ ...look, face: c.toDataURL('image/jpeg', 0.85) });
    stop(); setCam('off');
  };

  return (
    <div className="dk-setup">
      <h2 id="dk-title">Make your doll</h2>
      <p className="dk-sub">Pick a colour, and put your own face in the middle if you like.</p>

      <div className="dk-preview">
        <DollAvatar look={look} className="dk-big" />
        {cam === 'live' && <video ref={video} className="dk-live" muted playsInline aria-label="Your camera, live" />}
      </div>

      <div className="dk-swatches" role="group" aria-label="Doll colour">
        {COLORS.map((c) => (
          <button key={c.id} type="button" className="dk-swatch" style={{ background: c.body }} aria-pressed={look.color === c.id} aria-label={c.name} title={c.name} onClick={() => onChange({ ...look, color: c.id })} />
        ))}
      </div>
      <p className="dk-colorname" aria-live="polite">{colorOf(look.color).name}</p>

      <div className="dk-players" role="group" aria-label="How many players">
        <span>Players</span>
        {[2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-pressed={players === n} onClick={() => onPlayers(n)}>{n}</button>
        ))}
        <span className="dk-players-note">you and {players - 1} computer {players === 2 ? 'doll' : 'dolls'}</span>
      </div>

      <div className="dk-camrow">
        {cam === 'live' ? (
          <button type="button" className="dk-btn" onClick={snap}>Take photo</button>
        ) : (
          <button type="button" className="dk-btn is-quiet" onClick={start} disabled={cam === 'asking'}>
            {cam === 'asking' ? 'Waiting for the camera…' : look.face ? 'Retake photo' : 'Use my camera'}
          </button>
        )}
        {cam === 'live' && <button type="button" className="dk-btn is-quiet" onClick={() => { stop(); setCam('off'); }}>Cancel</button>}
        {cam !== 'live' && look.face && <button type="button" className="dk-btn is-quiet" onClick={() => onChange({ ...look, face: null })}>Remove photo</button>}
      </div>
      <p className="dk-note" role={cam === 'denied' ? 'alert' : undefined}>
        {cam === 'denied' ? 'The camera isn’t available (or was blocked), so your doll keeps its drawn face.' : 'Your photo stays in this tab. It isn’t uploaded anywhere.'}
      </p>

      <div className="dk-camrow">
        <button type="button" className="dk-btn is-go" onClick={() => { stop(); onDone(); }}>{cta}</button>
        <button type="button" className="dk-btn is-quiet" onClick={onHelp}>How to play</button>
      </div>
    </div>
  );
}
