import Image from "next/image";
import Link from "next/link";

import ActiveNavigation from "./ActiveNavigation";
import MobileMenu from "./MobileMenu";
import SessionTicker from "./SessionTicker";
import WatchApplyButton from "./WatchApplyButton";

// "Start Your Business Transformation Today" button, shortened to fit:
// "Start Today" at 768–1279px (the logo tagline is hidden at 1024–1279px to
// make room next to the nav), "Start Your Transformation" at 1280–1439px,
// the full text from 1440px, where the header may grow a little wider than
// the page (up to 1440px). Below 768px it's in the mobile menu.
export default function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div className="site-container relative flex items-center justify-between py-4 xl:max-w-[1440px]">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/rpians-logo.png"
            alt="RPIANS logo"
            width={44}
            height={33}
            className="h-9 w-auto md:h-11"
            priority
          />

          <div>
            <p className="text-xl font-bold tracking-[0.25em] text-[#3b82f6]">
              RPIANS
            </p>

            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600 sm:text-[10px] lg:hidden xl:block">
              World Class Business Coaching
            </p>
          </div>
        </Link>

        <ActiveNavigation />

        <div className="flex shrink-0 items-center gap-3 lg:gap-2">
          <WatchApplyButton
            from="Header"
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-4 py-3 text-sm font-bold text-white! transition hover:scale-105 md:inline-flex"
          >
            {/* Same variant type (min-[…]) throughout so the wider one wins. */}
            <span className="min-[1280px]:hidden">Start Today</span>
            <span className="hidden min-[1280px]:inline min-[1440px]:hidden">
              Start Your Transformation
            </span>
            <span className="hidden min-[1440px]:inline">
              Start Your Business Transformation Today
            </span>
          </WatchApplyButton>

          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-lg bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#1d4ed8] sm:block lg:px-5"
          >
            Login
          </Link>

          <MobileMenu />
        </div>
      </div>

      <SessionTicker />
    </header>
  );
}
