import type { Metadata } from "next";

import AnimatedWords from "../AnimatedWords";
import ApplyButton from "../ApplyButton";
import Reveal from "../Reveal";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import TiltCard from "../TiltCard";
import VideoTestimonials from "../VideoTestimonials";

export const metadata: Metadata = {
  title: "Masterclass",
  description:
    "Business Automation and Profit Masterclass — exclusive for serious business owners.",
};

const masterclassTopics = [
  "Business Automation",
  "Profit Multiplication",
  "Team Accountability",
  "Inventory Control",
  "Cash Flow Management",
  "KRA, KPI and SOPs",
];

export default function MasterclassPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        <VideoTestimonials />

        {/* MASTERCLASS */}

        <section
          id="masterclass"
          className="relative overflow-hidden border-y border-white/10 px-6 py-28"
        >
          <div className="relative mx-auto max-w-5xl">
            <Reveal direction="up" className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
                Exclusive for Serious Business Owners
              </p>

              <h2 className="mt-5 font-serif text-4xl md:text-6xl">
                <AnimatedWords
                  text="Business Automation"
                  stagger={0.1}
                  className="justify-center"
                />

                <span className="mt-2 block">
                  <AnimatedWords
                    text="and Profit Masterclass"
                    delay={0.25}
                    stagger={0.1}
                    className="justify-center"
                  />
                </span>
              </h2>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
                Learn how to reduce owner dependency, improve team accountability
                and multiply business profit through proven systems.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal direction="left" className="h-full">
                <TiltCard className="h-full rounded-3xl border border-white/10 bg-black/70 p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d9a441]">
                    What You Will Learn
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {masterclassTopics.map((item, index) => (
                      <Reveal
                        key={item}
                        direction="up"
                        delay={index * 0.08}
                      >
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#d9a441]/50">
                          <p className="font-semibold">{item}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal direction="right" delay={0.15} className="h-full">
                <TiltCard className="h-full rounded-3xl border border-[#d9a441]/30 bg-gradient-to-b from-[#d9a441]/10 to-black p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d9a441]">
                    Masterclass Details
                  </p>

                  <div className="mt-7 space-y-5">
                    <div className="border-b border-white/10 pb-5">
                      <p className="text-sm text-gray-500">Day</p>
                      <p className="mt-1 text-xl font-bold">Every Sunday</p>
                    </div>

                    <div className="border-b border-white/10 pb-5">
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="mt-1 text-xl font-bold">
                        10:00 AM to 12:00 PM
                      </p>
                    </div>

                    <div className="border-b border-white/10 pb-5">
                      <p className="text-sm text-gray-500">Mode</p>
                      <p className="mt-1 text-xl font-bold">
                        Live Online Session
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">For</p>
                      <p className="mt-1 text-xl font-bold">
                        Serious Business Owners
                      </p>
                    </div>
                  </div>

                  <ApplyButton className="mt-8 block w-full rounded-lg bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-8 py-4 text-center font-bold text-black transition hover:scale-[1.02]">
                    Register for the Masterclass
                  </ApplyButton>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
