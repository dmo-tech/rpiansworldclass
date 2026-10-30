"use client";

import { motion } from "motion/react";

import { revealMotion } from "./revealMotion";

const beforePoints = [
  "Owner involved in every small decision",
  "Team has no clear KRA and KPI",
  "Dead stock and blocked working capital",
  "No clear cash-flow visibility",
  "Daily firefighting and repeated mistakes",
  "Profit depends on guesswork",
];

const afterPoints = [
  "Business runs through systems and dashboards",
  "Team works with clear accountability",
  "Inventory becomes controlled and measurable",
  "Cash flow and working capital improve",
  "SOPs reduce owner dependency",
  "Profit decisions become data-driven",
];

export default function BeforeAfter() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="site-container">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            {...revealMotion()}
            className="reveal text-xs uppercase tracking-[0.35em] text-[#3b82f6]"
          >
            Business Transformation Comparison
          </motion.p>

          <motion.h2
            {...revealMotion(0.1)}
            className="reveal mt-5 font-serif text-4xl md:text-6xl"
          >
            Before RPIANS
            <span className="mx-3 text-gray-600">vs</span>
            <span className="text-[#1d4ed8]">After RPIANS</span>
          </motion.h2>

          <motion.p
            {...revealMotion(0.2)}
            className="reveal mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600"
          >
            See how an owner-dependent business transforms into a structured,
            automated and profitable organisation.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <motion.div
            {...revealMotion()}
            className="reveal relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-white p-8 md:p-10"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
                Before Systems
              </p>

              <h3 className="mt-4 font-serif text-3xl md:text-4xl">
                Business Chaos
              </h3>

              <div className="mt-8 space-y-5">
                {beforePoints.map((point, index) => (
                  <motion.div
                    key={point}
                    {...revealMotion(index * 0.05)}
                    className="reveal flex items-start gap-4"
                  >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 text-sm text-red-600">
                      ×
                    </span>

                    <p className="leading-7 text-gray-600">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...revealMotion(0.1)}
            className="reveal relative overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/12 to-white p-8 md:p-10"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#3b82f6]/15 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                After Implementation
              </p>

              <h3 className="mt-4 font-serif text-3xl text-[#1d4ed8] md:text-4xl">
                System-Driven Growth
              </h3>

              <div className="mt-8 space-y-5">
                {afterPoints.map((point, index) => (
                  <motion.div
                    key={point}
                    {...revealMotion(index * 0.05)}
                    className="reveal flex items-start gap-4"
                  >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/50 bg-[#3b82f6]/10 text-sm text-[#22c55e]">
                      ✓
                    </span>

                    <p className="leading-7 text-gray-600">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...revealMotion()}
          className="reveal mt-10 rounded-2xl border border-black/10 bg-black/[0.03] p-7 text-center"
        >
          <p className="text-lg leading-8 text-gray-600">
            RPIANS helps business owners move from
            <span className="font-semibold text-red-600">
              {" "}
              daily chaos{" "}
            </span>
            to
            <span className="font-semibold text-[#1d4ed8]">
              {" "}
              systems, automation, owner freedom and profit growth.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}