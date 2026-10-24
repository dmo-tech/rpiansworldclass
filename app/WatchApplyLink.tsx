"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
// mobile menu closes itself). The href, /watch?apply=1, is only followed when
// the link is opened in a new tab or the popup isn't there.
// On /watch itself it is a plain link that loads the page again: the details
// form opens and the new `from` goes into the lead source, the same as
// arriving from another page. A client-side link would only change the URL
// there. The player saves the video position when the page unloads, so the
// visitor still resumes.
export default function WatchApplyLink({
  href,
  from,
  className,
  onClick,
  children,
}: WatchApplyLinkProps) {
  const pathname = usePathname();

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

  if (pathname === "/watch") {
    return (
      <a
        href={href}
        onClick={handleClick}
        aria-haspopup="dialog"
        className={className}
      >
        {children}
      </a>
    );
  }

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
