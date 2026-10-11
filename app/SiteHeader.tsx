import Image from "next/image";
import Link from "next/link";

import ActiveNavigation from "./ActiveNavigation";
import MobileMenu from "./MobileMenu";
import SessionTicker from "./SessionTicker";

export default function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div className="site-container relative flex items-center justify-between py-4">
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

            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600 sm:text-[10px]">
              World Class Business Coaching
            </p>
          </div>
        </Link>

        <ActiveNavigation />

        <div className="flex shrink-0 items-center gap-3">
          {/* Plain text like the menu links: no box, blue on hover. */}
          <Link
            href="/login"
            className="hidden whitespace-nowrap py-2 text-sm text-gray-600! transition duration-300 hover:text-[#3b82f6]! sm:block"
          >
            Log in
          </Link>

          <MobileMenu />
        </div>
      </div>

      <SessionTicker />
    </header>
  );
}
