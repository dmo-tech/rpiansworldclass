import type { Metadata } from "next";

import CaseStudies from "../CaseStudies";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Real systems. Real implementation. Real business results from RPIANS clients.",
};

export default function ResultsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        <CaseStudies />
      </div>

      <SiteFooter />
    </main>
  );
}
