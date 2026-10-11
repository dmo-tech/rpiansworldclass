import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

// Every generic "Apply to Work With Us" button leads into the video: /watch
// opens with its details form, and `from` (the page or place of the button)
// is added to the lead's source so we can see which button was used.
export const watchApplyHref = (from: string) =>
  `/watch?apply=1&from=${encodeURIComponent(from)}`;

// ▶ in a circle, drawn with the video player's play triangle.
export function PlayCircleIcon({
  className = "h-[1.2em] w-[1.2em]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.79-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"
        transform="translate(6.2 6) scale(0.5)"
        fill="currentColor"
      />
    </svg>
  );
}

type WatchApplyButtonProps = {
  from: string;
  // Display, size and colours come from the page, to match its buttons.
  // Links need text-…! colours: globals.css sets `a { color: inherit }`.
  className: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function WatchApplyButton({
  from,
  className,
  children = "Apply to Work With Us",
  onClick,
}: WatchApplyButtonProps) {
  return (
    <Link href={watchApplyHref(from)} onClick={onClick} className={className}>
      <PlayCircleIcon />
      {children}
    </Link>
  );
}
