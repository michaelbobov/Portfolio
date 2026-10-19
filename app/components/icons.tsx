import type { SVGProps } from 'react';

// UI line icons, drawn from the Codex SVGs (ui set).
// Every icon is decorative (aria-hidden), takes `size` in px and draws in currentColor.

type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: number };

const line = (size: number, props: Omit<IconProps, 'size'>) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
  focusable: 'false' as const,
  ...props,
});

/** ui/arrow-up-right.svg */
export function ArrowUpRight({ size = 24, ...props }: IconProps) {
  return (
    <svg {...line(size, props)}>
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

/** ui/arrow-right.svg */
export function ArrowRight({ size = 24, ...props }: IconProps) {
  return (
    <svg {...line(size, props)}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

/** ui/arrow-left.svg */
export function ArrowLeft({ size = 24, ...props }: IconProps) {
  return (
    <svg {...line(size, props)}>
      <path d="M20 12H4m6-6-6 6 6 6" />
    </svg>
  );
}

/** ui/mail.svg */
export function Mail({ size = 24, ...props }: IconProps) {
  return (
    <svg {...line(size, props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

/** ui/document.svg */
export function Document({ size = 24, ...props }: IconProps) {
  return (
    <svg {...line(size, props)}>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Zm0 0v5h5M9 12h6m-6 4h6" />
    </svg>
  );
}

/** ui/external.svg */
export function External({ size = 24, ...props }: IconProps) {
  return (
    <svg {...line(size, props)}>
      <path d="M13 4h7v7m0-7L10 14m-1-9H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
