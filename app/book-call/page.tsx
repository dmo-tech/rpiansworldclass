import type { Metadata } from "next";

import BookingCalendar from "../BookingCalendar";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import WatchApplyButton from "../WatchApplyButton";

export const metadata: Metadata = {
  title: "Book a Call",
  description:
    "Book a consultation call with the RPIANS team. Pick a date and time that suits you.",
};

export default function BookCallPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />

      <section className="site-container pb-20 pt-32">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
            Book a Call
          </p>

          <h1 className="mt-5 font-serif text-4xl md:text-6xl">
            Schedule Your Consultation
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            Pick a date and time that works for you. Our team will call you
            to understand your business and guide you on the right program.
          </p>
        </div>

        <div className="mt-12">
          <BookingCalendar />
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row">
          <p>Not ready to book?</p>

          <WatchApplyButton
            from="Book a Call"
            className="inline-flex items-center gap-2 rounded-lg border border-[#3b82f6]/50 px-5 py-2.5 text-sm font-bold text-[#1d4ed8]! transition hover:bg-[#3b82f6]/10"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
