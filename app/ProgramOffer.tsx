import Link from "next/link";
import type { ReactNode } from "react";

// The offer block under a program page heading: label, ✅ points, price and
// either the orange button ("YES! I WANT MORE INFO" unless a page sets its
// own label) or a page's own button in its place (`action`). The orange
// button opens a WhatsApp / outside link in a new tab, and a site path
// ("/register?…") in the same tab.

type ProgramOfferProps = {
  label: string;
  title?: string;
  highlights: string[];
  price: ReactNode;
  priceNote?: string;
  badge?: string;
  // Centre on every screen size (program pages without a photo).
  centered?: boolean;
  // Tighter spacing and slightly smaller points / price, so the hero fits one
  // laptop screen (pairs with ProgramPageTemplate's compactHero).
  compact?: boolean;
} & (
  | { moreInfoUrl: string; moreInfoLabel?: string; action?: never }
  | { action: ReactNode; moreInfoUrl?: never; moreInfoLabel?: never }
);

const moreInfoClass = (compact: boolean) =>
  `${compact ? "mt-4" : "mt-6"} inline-flex w-full items-center justify-center rounded-lg bg-[#f97316] px-8 py-4 text-base font-bold tracking-wide text-white! shadow-[0_14px_34px_rgba(249,115,22,0.35)] transition hover:bg-[#ea580c] sm:w-auto`;

export function WaitlistBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
      {children}
    </span>
  );
}

export default function ProgramOffer({
  label,
  title,
  highlights,
  price,
  priceNote,
  badge,
  moreInfoUrl,
  moreInfoLabel = "YES! I WANT MORE INFO",
  action,
  centered = false,
  compact = false,
}: ProgramOfferProps) {
  return (
    <div
      className={`mx-auto ${compact ? "mt-5" : "mt-8"} ${centered ? "max-w-2xl" : "max-w-xl lg:mx-0"}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6]">
        {label}
      </p>

      {title && (
        <h2 className="mt-2 text-2xl font-bold text-[#0f172a] md:text-3xl">
          {title}
        </h2>
      )}

      <ul
        className={`${compact ? "mt-4 space-y-3" : "mt-6 space-y-4"} text-left ${centered ? "mx-auto max-w-xl" : ""}`}
      >
        {highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-lg leading-7">
              ✅
            </span>

            {/* Compact: text-pretty keeps a single word off the last line. */}
            <span
              className={`text-base leading-7 text-gray-700 ${compact ? "text-pretty" : "md:text-lg md:leading-8"}`}
            >
              {highlight}
            </span>
          </li>
        ))}
      </ul>

      <p
        className={`font-serif text-4xl font-bold text-[#0f172a] ${compact ? "mt-5" : "mt-8 md:text-5xl"}`}
      >
        {price}
      </p>

      {priceNote && <p className="mt-1 text-sm text-gray-500">{priceNote}</p>}

      {badge && (
        <p className={compact ? "mt-2" : "mt-3"}>
          <WaitlistBadge>{badge}</WaitlistBadge>
        </p>
      )}

      {action ??
        (moreInfoUrl?.startsWith("/") ? (
          <Link href={moreInfoUrl} className={moreInfoClass(compact)}>
            {moreInfoLabel}
          </Link>
        ) : (
          <a
            href={moreInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={moreInfoClass(compact)}
          >
            {moreInfoLabel}
          </a>
        ))}
    </div>
  );
}
