import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ThankYouDetails from "../ThankYouDetails";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Thank you for your payment to RPIANS World Class Business Coaching.",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ThankYouPage() {
  return (
    <main className="luxury-background flex min-h-[100dvh] flex-col text-[#0f172a]">
      <header className="relative z-10 flex justify-center px-4 pt-6 sm:pt-8">
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

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <ThankYouDetails />
      </div>

      <footer className="relative z-10 px-4 pb-6 text-center text-xs text-gray-400">
        © 2026 RPIANS World Class Business Coaching LLP. All Rights Reserved.
      </footer>
    </main>
  );
}
