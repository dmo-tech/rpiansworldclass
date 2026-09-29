import type { Metadata } from "next";

import BookCallBanner from "../BookCallBanner";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import TransformationJourney from "../TransformationJourney";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "See how RPIANS transforms an owner-dependent business into a structured, system-driven and profitable organisation.",
};

export default function JourneyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />

      <div className="pt-20">
        <TransformationJourney />
      </div>

      <BookCallBanner
        from="Journey"
        title="Ready to Start Your Transformation Journey?"
      />

      <SiteFooter />
    </main>
  );
}
