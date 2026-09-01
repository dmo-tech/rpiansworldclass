import type { Metadata } from "next";

import AnimatedWords from "../AnimatedWords";
import Reveal from "../Reveal";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import TiltCard from "../TiltCard";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Real systems. Real implementation. Real business results from RPIANS clients.",
};

const successStories = [
  {
    client: "Khandelwal General Stores, Betul",
    title: "Inventory Reduced by 30–40%",
    description:
      "The business had approximately 9,000 SKUs. After implementing the Inventory Management System, non-moving items were reduced, inventory control improved and blocked working capital was released.",
    result: "Inventory Control | Working Capital Improvement",
  },
  {
    client: "Ganpati Laminates",
    title: "₹1 Crore+ Monthly Sales",
    description:
      "SKU-wise gross-profit tracking, inventory-turnover analysis and product-portfolio optimisation helped the business focus on high-margin and fast-moving products.",
    result: "24%+ Gross Margin | 2X Profit Growth",
  },
  {
    client: "Janta Plywood, Bhopal",
    title: "Profit Doubled",
    description:
      "Inventory discipline, gross-profit tracking, cash-flow reviews and business dashboards resulted in stronger profitability and better business visibility.",
    result: "Positive Cash Flow | Profit Growth",
  },
  {
    client: "Panawa Boutique, Nagpur",
    title: "Owner Dependency Reduced",
    description:
      "Inventory systems, delegation structures and team accountability helped transfer most non-revenue activities from the owner to the team.",
    result: "Delegation | Team Accountability",
  },
  {
    client: "Mamaji Jewellers, Betul",
    title: "Multiple Showrooms, Better Control",
    description:
      "Centralised inventory visibility and structured systems helped manage multiple showrooms with stronger control, tracking and decision-making.",
    result: "System-Driven Operations | Better Control",
  },
  {
    client: "Business Automation Client",
    title: "Business Runs Without Daily Firefighting",
    description:
      "KRA, KPI, SOPs, dashboards and structured reviews improved team accountability and reduced the owner’s daily operational involvement.",
    result: "Autopilot Systems | Owner Freedom",
  },
];

export default function ResultsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        {/* SUCCESS STORIES */}

        <section id="results" className="px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up" className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
                Business Transformation
              </p>

              <h2 className="mt-5 font-serif text-4xl md:text-6xl">
                <AnimatedWords
                  text="Real Systems. Real Implementation."
                  stagger={0.08}
                  className="justify-center"
                />

                <span className="mt-2 block">
                  <AnimatedWords
                    text="Real Business Results."
                    delay={0.25}
                    stagger={0.1}
                    className="justify-center"
                  />
                </span>
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {successStories.map((story, index) => (
                <Reveal
                  key={`${story.client}-${story.title}`}
                  direction="up"
                  delay={(index % 3) * 0.12}
                  className="h-full"
                >
                  <TiltCard className="group relative h-full overflow-hidden rounded-2xl border border-[#d9a441]/20 bg-gradient-to-b from-[#d9a441]/10 to-white/[0.02] p-8 transition hover:border-[#d9a441]/60">
                    <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.16em] text-[#d9a441]">
                      {story.client}
                    </p>

                    <h3 className="relative z-10 mt-5 text-2xl font-bold transition group-hover:text-[#edc66d]">
                      {story.title}
                    </h3>

                    <p className="relative z-10 mt-5 leading-7 text-gray-400">
                      {story.description}
                    </p>

                    <div className="relative z-10 mt-6 border-t border-white/10 pt-5">
                      <p className="text-sm font-semibold text-[#edc66d]">
                        {story.result}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#8c5a17] via-[#f1c363] to-[#d9a441] transition-all duration-500 group-hover:w-full" />
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
