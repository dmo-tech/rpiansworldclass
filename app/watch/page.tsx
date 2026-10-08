import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import WatchExperience from "../WatchExperience";

export const metadata: Metadata = {
  title: "Watch the Transformation",
  description:
    "Watch how business owners transform their business with systems, dashboards, accountability and implementation.",
  alternates: {
    canonical: "/watch",
  },
};

export default function WatchPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-white text-[#0f172a]">
      <header className="flex justify-center px-4 pt-6 sm:pt-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/rpians-logo.png"
            alt="RPIANS logo"
            width={44}
            height={33}
            className="h-10 w-auto sm:h-12"
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
      </header>

      <div className="flex-1">
        <WatchExperience />
      </div>

      <footer className="px-4 pb-6 pt-4 text-center text-xs text-gray-400">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <a href="/privacy-policy" className="transition hover:text-[#3b82f6]">
            Privacy Policy
          </a>
          <a href="/terms" className="transition hover:text-[#3b82f6]">
            Terms and Conditions
          </a>
          <a href="/refund-policy" className="transition hover:text-[#3b82f6]">
            Refund Policy
          </a>
        </nav>

        <p className="mt-3">
          © 2026 RPIANS World Class Business Coaching LLP. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
