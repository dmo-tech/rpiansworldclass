import type { Metadata } from "next";

import AnimatedWords from "../AnimatedWords";
import Reveal from "../Reveal";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import TiltCard from "../TiltCard";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "Implement practical systems that improve team accountability, inventory control, working capital and business profitability.",
};

const systems = [
  {
    title: "Inventory Management System",
    shortName: "IMS",
    description:
      "Control dead stock, improve inventory rotation and release blocked working capital.",
  },
  {
    title: "HR Management System",
    shortName: "HRMS",
    description:
      "Build team accountability with KRA, KPI, training and performance tracking.",
  },
  {
    title: "Profit Multiplication System",
    shortName: "PMS",
    description:
      "Track gross profit, control expenses and improve business profitability.",
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
];

export default function SystemsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        {/* SYSTEMS */}

        <section
          id="systems"
          className="border-y border-white/10 bg-white/[0.02] px-6 py-28"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal direction="up" className="mx-auto max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
                Our Proven Systems
              </p>

              <h2 className="mt-5 font-serif text-4xl md:text-6xl">
                <AnimatedWords
                  text="Build a Business That Works"
                  stagger={0.09}
                  className="justify-center"
                />

                <span className="mt-2 block">
                  <AnimatedWords
                    text="Without Your Daily Involvement"
                    delay={0.25}
                    stagger={0.09}
                    className="justify-center"
                  />
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
                Implement practical systems that improve team accountability,
                inventory control, working capital and business profitability.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {systems.map((system, index) => (
                <Reveal
                  key={system.title}
                  direction="up"
                  delay={(index % 3) * 0.12}
                  className="h-full"
                >
                  <TiltCard className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black p-7 transition-colors duration-300 hover:border-[#d9a441]/60">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#d9a441]/0 blur-3xl transition duration-500 group-hover:bg-[#d9a441]/15" />

                    <div
                      className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-[#d9a441]/40 bg-[#d9a441]/10 text-sm font-bold text-[#edc66d]"
                      style={{
                        transform: "translateZ(45px)",
                      }}
                    >
                      {system.shortName}
                    </div>

                    <h3
                      className="relative z-10 mt-6 text-xl font-semibold transition group-hover:text-[#edc66d]"
                      style={{
                        transform: "translateZ(35px)",
                      }}
                    >
                      {system.title}
                    </h3>

                    <p
                      className="relative z-10 mt-4 leading-7 text-gray-400"
                      style={{
                        transform: "translateZ(25px)",
                      }}
                    >
                      {system.description}
                    </p>

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
