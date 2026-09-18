import type { ReactNode } from "react";

import AnimatedWords from "./AnimatedWords";
import ApplyButton from "./ApplyButton";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import TiltCard from "./TiltCard";
import type { WhoIsThisForSegment } from "./whoIsThisForData";

export default function WhoIsThisForTemplate({
  label,
  eyebrow,
  headingLine1,
  headingLine2,
  description,
  audience,
  painPoints,
  solutions,
  businessTypes,
}: WhoIsThisForSegment): ReactNode {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />

      <div className="pt-20">
        <section className="relative overflow-hidden border-y border-black/10 px-6 py-28">
          <div className="relative mx-auto max-w-5xl">
            <Reveal direction="up" className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
                {eyebrow}
              </p>

              <h1 className="mt-5 font-serif text-4xl md:text-6xl">
                <AnimatedWords
                  text={headingLine1}
                  stagger={0.1}
                  className="justify-center"
                />

                <span className="mt-2 block text-[#1d4ed8]">
                  <AnimatedWords
                    text={headingLine2}
                    delay={0.25}
                    stagger={0.1}
                    className="justify-center"
                  />
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-600">
                {description}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal direction="left" className="h-full">
                <TiltCard className="h-full rounded-3xl border border-black/10 bg-black/[0.03] p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Where You Are Losing Profit
                  </p>

                  <div className="mt-7 space-y-4">
                    {painPoints.map((point, index) => (
                      <Reveal key={point} direction="up" delay={index * 0.08}>
                        <div className="rounded-xl border border-black/10 bg-white p-4">
                          <p className="font-medium">{point}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal direction="right" delay={0.15} className="h-full">
                <TiltCard className="h-full rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/10 to-white p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Systems We Help You Build
                  </p>

                  <div className="mt-7 space-y-4">
                    {solutions.map((solution, index) => (
                      <Reveal
                        key={solution}
                        direction="up"
                        delay={index * 0.08}
                      >
                        <div className="rounded-xl border border-[#3b82f6]/20 bg-white p-4">
                          <p className="font-medium">{solution}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>
            </div>

            <Reveal direction="up" delay={0.2} className="mt-12">
              <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                Top 20 {label} Business Types We Work With
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {businessTypes.map((type, index) => (
                  <Reveal key={type} direction="up" delay={index * 0.03}>
                    <div className="flex h-full items-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3">
                      <span className="text-sm font-bold text-[#3b82f6]">
                        {index + 1}.
                      </span>
                      <p className="text-sm font-medium">{type}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.3}>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 rounded-3xl border border-black/10 bg-black/[0.03] p-8 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <p className="text-sm text-gray-500">Built For</p>
                  <p className="mt-1 text-xl font-bold">{audience}</p>
                </div>

                <ApplyButton className="w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-9 py-4 text-base font-bold text-white transition hover:scale-105 sm:w-auto">
                  Apply to Work With Us
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
