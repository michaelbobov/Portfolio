'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export type Pic = { src: string; alt: string; width: number; height: number };

// Widest a picture gets when zoomed into detail, in CSS pixels
const DETAIL = 2400;

// A screen in the reading column that opens larger in place. It opens fitted to the window; clicking
// the picture zooms into detail (scroll or drag to pan) and back. Clicking outside it, Escape or Close
// comes straight back to the page. Nothing opens in a new tab, and the large copy only loads once it's
// opened. `fit` caps the height in the column (tall screens would otherwise fill the window); the width
// is set from it up front, so the page keeps its place while pictures load.
export default function Zoom({ img, sizes, fit }: { img: Pic; sizes: string; fit?: number }) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const show = () => {
    setOpen(true);
    document.documentElement.classList.add('st-locked');
    ref.current?.showModal();
  };
  const hide = () => ref.current?.close();
  const detailWidth = Math.min(img.width, DETAIL);
  return (
    <>
      <button type="button" className="st-zoom" onClick={show} style={fit ? { width: `min(100%, ${Math.round((fit * img.width) / img.height)}px)` } : undefined}>
        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} quality={90} />
        <span className="sr-only"> (enlarge)</span>
      </button>
      <dialog
        ref={ref}
        className={`st-lightbox${detail ? ' is-detail' : ''}`}
        aria-label={img.alt}
        onClick={hide}
        onClose={() => {
          setOpen(false);
          setDetail(false);
          document.documentElement.classList.remove('st-locked');
        }}
      >
        <button type="button" className="st-lightbox-close" onClick={hide}>Close</button>
        {open && (
          <button
            type="button"
            className="st-lightbox-pic"
            aria-label={detail ? 'Fit to the window' : 'Zoom in'}
            onClick={(e) => {
              e.stopPropagation();
              setDetail((d) => !d);
            }}
          >
            <Image src={img.src} alt="" width={img.width} height={img.height} sizes={detail ? `${detailWidth}px` : '100vw'} quality={90} loading="eager" style={detail ? { width: detailWidth } : undefined} />
          </button>
        )}
        <p className="st-lightbox-hint" aria-hidden="true">{detail ? 'Click to fit' : 'Click the picture to zoom in'}</p>
      </dialog>
    </>
  );
}
