"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEventHandler, ReactNode } from "react";

type WatchApplyLinkProps = {
  href: string;
  className: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
};

// The link inside WatchApplyButton. On /watch itself (header menu, footer) it
// is a plain link that loads the page again: the details form opens and the
// new `from` goes into the lead source, the same as arriving from another
// page. A client-side link would only change the URL there. The player saves
// the video position when the page unloads, so the visitor still resumes.
export default function WatchApplyLink({
  href,
  className,
  onClick,
  children,
}: WatchApplyLinkProps) {
  const pathname = usePathname();

  if (pathname === "/watch") {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
