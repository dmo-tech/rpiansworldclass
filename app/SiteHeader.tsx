import Image from "next/image";
import Link from "next/link";

import ActiveNavigation from "./ActiveNavigation";
import ApplyButton from "./ApplyButton";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
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
          <ApplyButton className="hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-[#15803d] to-[#14532d] px-6 py-3 text-sm font-bold text-white transition hover:scale-105 sm:block">
            Apply Now
          </ApplyButton>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
