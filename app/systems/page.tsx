import type { Metadata } from "next";

import AnimatedWords from "../AnimatedWords";
import EnquireNowTab from "../EnquireNowTab";
import Reveal from "../Reveal";
import ApplyBanner from "../ApplyBanner";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import TiltCard from "../TiltCard";
import WatchApplyButton from "../WatchApplyButton";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "Implement proven business systems that reduce owner dependency, improve team accountability, control inventory, strengthen cash flow, and drive sustainable profit growth.",
};

const systems = [
  {
    title: "Advanced Inventory Management System",
    shortName: "AIMS",
    description:
      "Control dead stock, improve inventory rotation and release blocked working capital with smart, data-driven inventory control.",
  },
  {
    title: "Team Accountability System",
    shortName: "TAS",
    description:
      "Build team accountability with clear KRA, KPI, training and daily performance tracking.",
  },
  {
    title: "GP Dashboard System",
    shortName: "GPD",
    description:
      "Track gross profit product-wise and category-wise, control expenses and improve business profitability.",
  },
  {
    title: "Cash Flow Management",
    shortName: "CFM",
    description:
      "Strengthen working capital, debtor control and day-to-day cash visibility.",
  },
  {
    title: "Standard Operating Procedures",
    shortName: "SOP",
    description:
      "Create repeatable processes so your business does not depend on the owner.",
  },
  {
    title: "AI and Business Automation",
    shortName: "AI",
    description:
      "Use dashboards, automation tools and technology for faster business decisions.",
  },
  {
    title: "Sales Person Wise Sales System",
    shortName: "SPS",
    description:
      "Track sales, targets and conversions for every sales person, so you know who is performing and where to improve.",
  },
  {
    title: "Project Management System",
    shortName: "PMS",
    description:
      "Plan projects, assign tasks, track deadlines and progress, and make sure every project is delivered on time.",
  },
  {
    title: "Production Management System",
    shortName: "PMS",
    description:
      "Plan production, track raw material and output, and reduce wastage for smooth, on-time manufacturing.",
  },
];

export default function SystemsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />
      <EnquireNowTab from="Systems - Enquire Now" />

      <div className="pt-20">
        {/* SYSTEMS */}

        <section
          id="systems"
          className="border-y border-black/10 bg-black/[0.02] py-28"
        >
          <div className="site-container">
            <Reveal direction="up" className="mx-auto max-w-6xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
                Our Proven Systems
              </p>

              {/* Sized so each line stays whole from tablets up. */}
              <h2 className="mt-5 font-serif text-4xl lg:text-5xl xl:text-6xl">
                <AnimatedWords
                  text="Run Your Business on Autopilot Mode"
                  stagger={0.09}
                  className="justify-center"
                />

                <span className="mt-2 block text-[#1d4ed8]">
                  <AnimatedWords
                    text="& Multiply Your Profits Every Year"
                    delay={0.25}
                    stagger={0.09}
                    className="justify-center"
                  />
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                Implement proven business systems that reduce owner dependency,
                improve team accountability, control inventory, strengthen cash
                flow, and drive sustainable profit growth.
              </p>

              <div className="mt-9 flex justify-center">
                <WatchApplyButton
                  from="Systems - Hero"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-10 py-4 font-bold text-white! transition hover:scale-105 sm:w-auto"
                />
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {systems.map((system, index) => (
                <Reveal
                  key={system.title}
                  direction="up"
                  delay={(index % 3) * 0.12}
                  className="h-full"
                >
                  <TiltCard className="group relative h-full overflow-hidden rounded-2xl border border-black/10 bg-white p-7 transition-colors duration-300 hover:border-[#3b82f6]/60">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#3b82f6]/0 blur-3xl transition duration-500 group-hover:bg-[#3b82f6]/15" />

                    <div
                      className="relative z-10 flex h-14 w-fit min-w-14 items-center justify-center rounded-xl border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-3 text-sm font-bold text-[#1d4ed8]"
                      style={{
                        transform: "translateZ(45px)",
                      }}
                    >
                      {system.shortName}
                    </div>

                    <h3
                      className="relative z-10 mt-6 text-xl font-semibold transition group-hover:text-[#1d4ed8]"
                      style={{
                        transform: "translateZ(35px)",
                      }}
                    >
                      {system.title}
                    </h3>

                    <p
                      className="relative z-10 mt-4 leading-7 text-gray-600"
                      style={{
                        transform: "translateZ(25px)",
                      }}
                    >
                      {system.description}
                    </p>

                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6] transition-all duration-500 group-hover:w-full" />
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ApplyBanner
        from="Systems"
        title="Want These Systems in Your Business?"
        description="Watch our free RPIANS training video to discover how proven systems can help you automate your business and multiply your profits. Take the first step toward transforming your business today."
      />

      <SiteFooter />
    </main>
  );
}
