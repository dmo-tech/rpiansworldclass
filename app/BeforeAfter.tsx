"use client";

import { motion } from "motion/react";

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
    <section className="relative overflow-hidden px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]"
          >
            Business Transformation Comparison
          </motion.p>

          <motion.h2
            initial={{
              opacity: 0,
              y: 45,
              filter: "blur(8px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 font-serif text-4xl md:text-6xl"
          >
            Before RPIANS
            <span className="mx-3 text-gray-600">vs</span>
            <span className="text-[#60a5fa]">After RPIANS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400"
          >
            See how an owner-dependent business transforms into a structured,
            automated and profitable organisation.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{
              opacity: 0,
              x: -90,
              rotateY: -8,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              rotateY: 0,
            }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-black p-8 md:p-10"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
                Before Systems
              </p>

              <h3 className="mt-4 font-serif text-3xl md:text-4xl">
                Business Chaos
              </h3>

              <div className="mt-8 space-y-5">
                {beforePoints.map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.7 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 text-sm text-red-400">
                      ×
                    </span>

                    <p className="leading-7 text-gray-300">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 90,
              rotateY: 8,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              rotateY: 0,
            }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/12 to-black p-8 md:p-10"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#3b82f6]/15 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                After Implementation
              </p>

              <h3 className="mt-4 font-serif text-3xl text-[#93c5fd] md:text-4xl">
                System-Driven Growth
              </h3>

              <div className="mt-8 space-y-5">
                {afterPoints.map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.7 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/50 bg-[#3b82f6]/10 text-sm text-[#facc15]">
                      ✓
                    </span>

                    <p className="leading-7 text-gray-300">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center"
        >
          <p className="text-lg leading-8 text-gray-300">
            RPIANS helps business owners move from
            <span className="font-semibold text-red-400">
              {" "}
              daily chaos{" "}
            </span>
            to
            <span className="font-semibold text-[#93c5fd]">
              {" "}
              systems, automation, owner freedom and profit growth.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}