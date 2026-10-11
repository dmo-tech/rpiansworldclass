import Image from "next/image";
import Link from "next/link";

import ActiveNavigation from "./ActiveNavigation";
import MobileMenu from "./MobileMenu";
import SessionTicker from "./SessionTicker";
import WatchApplyButton from "./WatchApplyButton";

// Desktop fit: 1024–1279px drops Book a Call and the logo tagline and shows
// "Apply Now"; 1280–1359px has Book a Call + "Apply Now"; from 1360px the
// full "Apply to Work With Us" fits, as the header may grow a little wider
// than the page (up to 1440px). Below 1024px Apply is in the mobile menu.
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

        <div className="flex shrink-0 items-center gap-3 lg:gap-2 min-[1440px]:gap-3">
          <Link
            href="/book-call"
            className="hidden whitespace-nowrap rounded-lg border border-[#3b82f6]/40 px-5 py-3 text-sm font-bold text-[#1d4ed8] transition hover:scale-105 hover:border-[#3b82f6] md:block lg:hidden xl:block"
          >
            Book a Call
          </Link>

          <WatchApplyButton
            from="Header"
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-4 py-3 text-sm font-bold text-white! transition hover:scale-105 lg:inline-flex min-[1440px]:px-5"
          >
            <span className="min-[1360px]:hidden">Apply Now</span>
            <span className="hidden min-[1360px]:inline">
              Apply to Work With Us
            </span>
          </WatchApplyButton>

          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-lg bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#1d4ed8] sm:block lg:px-5 min-[1440px]:px-6"
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
