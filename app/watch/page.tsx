import type { Metadata } from "next";

import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
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
    <main className="relative min-h-screen overflow-x-clip bg-white text-[#0f172a]">
      <SiteHeader />

      {/* Room for the fixed header (77px), as on /about. The video's height
          budget in WatchExperience counts on these 80px. */}
      <div className="pt-20">
        <WatchExperience />
      </div>

      <SiteFooter />
    </main>
  );
}
