"use client";

import { motion } from "motion/react";
import Link from "next/link";

const journeySteps = [
  {
    number: "01",
    title: "Daily Firefighting",
    description:
      "The business owner is involved in every decision, problem and daily operation.",
  },
  {
    number: "02",
    title: "Business Visibility",
    description:
      "Inventory, cash flow, gross profit and team performance become measurable.",
  },
  {
    number: "03",
    title: "Team Accountability",
    description:
      "KRA, KPI, training and structured reviews make the team responsible for results.",
  },
  {
    number: "04",
    title: "Systems and SOPs",
    description:
      "Repeatable processes reduce mistakes, delays and dependency on the owner.",
  },
  {
    number: "05",
    title: "Business Automation",
    description:
      "Dashboards, technology and automated workflows improve speed and control.",
  },
  {
    number: "06",
    title: "Owner Freedom and Profit Growth",
    description:
      "The business becomes system-driven, scalable and more profitable every year.",
  },
];

export default function TransformationJourney() {
  return (
    <section
      id="journey"
      className="relative overflow-hidden border-y border-black/10 bg-black/[0.02] px-6 py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]"
          >
            The RPIANS Transformation Journey
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 font-serif text-4xl md:text-6xl"
          >
            From Business Chaos
            <span className="mt-2 block text-[#1d4ed8]">
              to Autopilot and Profit Growth
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600"
          >
            See how RPIANS transforms an owner-dependent business into a
            structured, system-driven and profitable organisation.
          </motion.p>
        </div>

        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Desktop centre line */}

          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-black/10 md:block">
            <motion.div
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 2.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full bg-gradient-to-b from-[#3b82f6] via-[#22c55e] to-[#3b82f6]"
            />
          </div>

          <div className="space-y-12 md:space-y-6">
            {journeySteps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    x: isLeft ? -90 : 90,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.45,
                  }}
                  transition={{
                    duration: 0.85,
                    delay: 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative grid items-center md:grid-cols-2 ${
                    isLeft ? "" : "md:text-left"
                  }`}
                >
                  <div
                    className={
                      isLeft
                        ? "md:pr-16"
                        : "md:col-start-2 md:pl-16"
                    }
                  >
                    <motion.div
                      whileHover={{
                        y: -6,
                        scale: 1.015,
                      }}
                      transition={{ duration: 0.25 }}
                      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-7 transition hover:border-[#3b82f6]/60"
                    >
                      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#3b82f6]/0 blur-3xl transition duration-500 group-hover:bg-[#3b82f6]/15" />

                      <div className="relative z-10 flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/50 bg-[#3b82f6]/10 text-sm font-bold text-[#22c55e]">
                          {step.number}
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold transition group-hover:text-[#1d4ed8]">
                            {step.title}
                          </h3>

                          <p className="mt-4 leading-7 text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6] transition-all duration-500 group-hover:w-full" />
                    </motion.div>
                  </div>

                  {/* Timeline circle */}

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.8 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.2,
                    }}
                    className="absolute left-1/2 top-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.7)] md:block"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-20 max-w-4xl rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-r from-[#3b82f6]/10 via-white to-[#3b82f6]/10 p-8 text-center md:p-12"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3b82f6]">
            Final Transformation
          </p>

          <h3 className="mt-5 font-serif text-3xl md:text-5xl">
            Your Business Works Without Depending on You
          </h3>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600">
            You move from daily operational pressure to leadership, strategy,
            growth and long-term wealth creation.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6] px-9 py-4 font-bold text-white transition hover:scale-105"
          >
            Start Your Transformation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}