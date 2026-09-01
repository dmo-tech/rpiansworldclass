import Link from "next/link";

import ActiveNavigation from "./ActiveNavigation";
import ApplyButton from "./ApplyButton";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="shrink-0">
          <p className="text-xl font-bold tracking-[0.25em] text-[#d9a441]">
            RPIANS
          </p>

          <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 sm:text-[10px]">
            World Class Business Coaching
          </p>
        </Link>

        <ActiveNavigation />

        <div className="flex shrink-0 items-center gap-3">
          <ApplyButton className="hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-6 py-3 text-sm font-bold text-black transition hover:scale-105 sm:block">
            Apply Now
          </ApplyButton>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
