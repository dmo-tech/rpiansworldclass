import Link from "next/link";
import type { ReactNode } from "react";

type BookCallButtonProps = {
  // Page or section the visitor came from. Saved with the booking in the
  // Google Sheet so we can see which placements bring calls.
  from: string;
  children?: ReactNode;
  className?: string;
};

export function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export default function BookCallButton({
  from,
  children = "Book a Call",
  className = "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#3b82f6]/60 px-9 py-4 text-center font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6]/10 sm:w-auto",
}: BookCallButtonProps) {
  return (
    <Link
      href={`/book-call?from=${encodeURIComponent(from)}`}
      className={className}
    >
      <CalendarIcon />
      {children}
    </Link>
  );
}
