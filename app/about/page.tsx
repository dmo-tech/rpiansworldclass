import type { Metadata } from "next";

import AnimatedWords from "../AnimatedWords";
import ApplyButton from "../ApplyButton";
import ParallaxImage from "../ParallaxImage";
import Reveal from "../Reveal";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rajesh Kumar Kare, TEDx Speaker and founder of RPIANS World Class Business Coaching LLP.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        {/* ABOUT */}

        <section id="about" className="px-6 py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="relative h-[560px] overflow-hidden rounded-3xl border border-[#d9a441]/30 bg-neutral-900">
                <ParallaxImage
                  src="/rajesh-kumar-kare.jpg"
                  alt="Rajesh Kumar Kare"
                  className="object-top"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-8 pt-28">
                  <h3 className="text-2xl font-bold">Rajesh Kumar Kare</h3>

                  <p className="mt-2 text-[#d9a441]">
                    TEDx Speaker | Business Automation & Profit Coach
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.15}>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
                  Your Business Growth Advisor
                </p>

                <h2 className="mt-5 font-serif text-4xl text-[#e0ad4d] md:text-5xl">
                  <AnimatedWords
                    text="Rajesh Kumar Kare"
                    stagger={0.12}
                    className="justify-start"
                  />
                </h2>

                <p className="mt-3 text-lg text-gray-200">
                  TEDx Speaker | Business Automation & Profit Coach
                </p>

                <p className="mt-7 leading-8 text-gray-300">
                  Founder of RPIANS World Class Business Coaching LLP, Rajesh
                  Kumar Kare helps entrepreneurs run their businesses on
                  autopilot mode and multiply profit every year through
                  implementation-focused systems.
                </p>

                <p className="mt-5 leading-8 text-gray-300">
                  His approach combines Inventory Management, HRMS, KRA, KPI,
                  working-capital control, cash-flow management, SOPs, dashboards
                  and AI-driven automation.
                </p>

                <ApplyButton className="mt-9 inline-block rounded-lg bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-9 py-4 font-bold text-black transition hover:scale-105">
                  Work With Rajesh Kumar Kare
                </ApplyButton>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
