"use client";

import Link from "next/link";
import type { MouseEvent, MouseEventHandler, ReactNode } from "react";

import { openApplyCheck } from "./applyFlow";

type WatchApplyLinkProps = {
  href: string;
  from: string;
  className: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
};

// The link inside WatchApplyButton. A click opens the "One Important Thing"
// popup (ApplyCheckPopup) on this page, after the page's own onClick (the
// mobile menu closes itself). The href, the video on /watch, is only followed
// when the link is opened in a new tab or the popup isn't there.
export default function WatchApplyLink({
  href,
  from,
  className,
  onClick,
  children,
}: WatchApplyLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const opensElsewhere =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (!event.defaultPrevented && !opensElsewhere && openApplyCheck(from)) {
      event.preventDefault();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </Link>
  );
}
