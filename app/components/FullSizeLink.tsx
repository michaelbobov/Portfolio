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
    <a
      href={encodeURI(src)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block ${className}`}
    >
      {children}
      <span className="mt-2 block font-mono text-xs text-gray-500 group-hover:text-[#B5502F] transition-colors">
        Open full size ↗<span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}
