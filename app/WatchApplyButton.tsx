import type { MouseEventHandler, ReactNode } from "react";

import { watchApplyHref } from "./applyFlow";
import WatchApplyLink from "./WatchApplyLink";

// Every "Start Your Business Transformation Today" button (formerly "Apply to
// Work With Us") and "Enquire Now" first asks whether the visitor has watched
// the full video (ApplyCheckPopup): "Yes" books the strategy call, "No" leads
// into the video (/watch opens with its details form). `from` (the page or
// place of the button) is added to the lead's source so we can see which
// button was used.

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
  // Defaults to ▶ in a circle.
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function WatchApplyButton({
  from,
  className,
  children = "Start Your Business Transformation Today",
  icon = <PlayCircleIcon />,
  onClick,
}: WatchApplyButtonProps) {
  return (
    <WatchApplyLink
      href={watchApplyHref(from)}
      from={from}
      onClick={onClick}
      className={className}
    >
      {icon}
      {/* Long label: wraps into even, centred lines on narrow buttons. */}
      <span className="text-balance text-center">{children}</span>
    </WatchApplyLink>
  );
}
