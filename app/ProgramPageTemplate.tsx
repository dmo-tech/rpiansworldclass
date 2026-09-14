import type { ReactNode } from "react";

import Image from "next/image";

import AnimatedWords from "./AnimatedWords";
import ApplyButton from "./ApplyButton";
import { formatPlanAmount, plans } from "./plans";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import TiltCard from "./TiltCard";

type ProgramPageTemplateProps = {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  duration: string;
  mode: string;
  audience: string;
  topics: string[];
  ctaLabel: string;
  photoSrc?: string;
  photoAlt?: string;
  headingClassName?: string;
  eyebrowClassName?: string;
  planId?: string;
};

export default function ProgramPageTemplate({
  eyebrow,
  headingLine1,
  headingLine2,
  description,
  duration,
  mode,
  audience,
  topics,
  ctaLabel,
  photoSrc,
  photoAlt,
  headingClassName,
  eyebrowClassName,
  planId,
}: ProgramPageTemplateProps): ReactNode {
  const plan = plans.find((item) => item.id === planId);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />

      <div className="pt-20">
        <section
          className="relative overflow-hidden border-y border-black/10 px-6 py-28"
        >
          <div className="relative mx-auto max-w-5xl">
            {photoSrc ? (
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <Reveal direction="up" className="text-center lg:text-left">
                  <p
                    className={
                      eyebrowClassName ??
                      "text-xs uppercase tracking-[0.35em] text-[#3b82f6]"
                    }
                  >
                    {eyebrow}
                  </p>

                  <h1
                    className={`mt-5 font-serif ${headingClassName ?? "text-4xl md:text-5xl"}`}
                  >
                    <AnimatedWords
                      text={headingLine1}
                      stagger={0.1}
                      className="justify-center lg:justify-start"
                    />

                    <span className="mt-2 block text-[#1d4ed8]">
                      <AnimatedWords
                        text={headingLine2}
                        delay={0.25}
                        stagger={0.1}
                        className="justify-center lg:justify-start"
                      />
                    </span>
                  </h1>

                  <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-gray-600 lg:mx-0">
                    {description}
                  </p>
                </Reveal>

                <Reveal
                  direction="right"
                  className="flex justify-center lg:justify-end"
                >
                  <div className="relative h-[360px] w-full max-w-sm sm:h-[440px] lg:h-[480px]">
                    <Image
                      src={photoSrc}
                      alt={photoAlt ?? "RPIANS"}
                      fill
                      priority
                      className="object-contain object-top"
                    />
                  </div>
                </Reveal>
              </div>
            ) : (
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
            )}

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal direction="left" className="h-full">
                <TiltCard className="h-full rounded-3xl border border-black/10 bg-black/[0.03] p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    What You Will Work On
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {topics.map((topic, index) => (
                      <Reveal key={topic} direction="up" delay={index * 0.08}>
                        <div className="rounded-xl border border-black/10 bg-white p-5 transition hover:border-[#3b82f6]/50">
                          <p className="font-semibold">{topic}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal direction="right" delay={0.15} className="h-full">
                <TiltCard className="h-full rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/10 to-white p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Program Details
                  </p>

                  <div className="mt-7 space-y-5">
                    <div className="border-b border-black/10 pb-5">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="mt-1 text-xl font-bold">{duration}</p>
                    </div>

                    <div className="border-b border-black/10 pb-5">
                      <p className="text-sm text-gray-500">Mode</p>
                      <p className="mt-1 text-xl font-bold">{mode}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">For</p>
                      <p className="mt-1 text-xl font-bold">{audience}</p>
                    </div>
                  </div>

                  {plan && (
                    <div className="mt-7 rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-6">
                      <p className="text-sm font-semibold text-[#1d4ed8]">
                        {plan.label} — Booking Amount
                      </p>

                      <p className="mt-2 font-serif text-4xl font-bold">
                        {formatPlanAmount(plan)}
                      </p>
                    </div>
                  )}

                  <ApplyButton
                    plan={planId}
                    className="mt-8 block w-full rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-8 py-4 text-center font-bold text-white transition hover:scale-[1.02]"
                  >
                    {ctaLabel}
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
