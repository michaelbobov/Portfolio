import type { ReactNode } from 'react';

// Wraps a detailed screen so it can be opened at full resolution (useful on phones)
export default function FullSizeLink({
  src,
  className = '',
  children,
}: {
  src: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={encodeURI(src)} target="_blank" rel="noopener noreferrer" className={`cs-full ${className}`}>
      {children}
      <span className="cs-full-label">
        Open full size ↗<span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}
