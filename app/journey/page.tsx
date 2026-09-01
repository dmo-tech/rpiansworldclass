import type { Metadata } from "next";

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
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        <TransformationJourney />
      </div>

      <SiteFooter />
    </main>
  );
}
