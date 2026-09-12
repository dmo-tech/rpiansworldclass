"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

const leakStages = [
  {
    number: "01",
    title: "Inventory Leakage",
    description:
      "Dead stock, slow-moving products and excess inventory block your working capital.",
    metric: "Dead Stock",
    value: 38,
  },
  {
    number: "02",
    title: "Team Productivity Leakage",
    description:
      "Without KRA, KPI and accountability, your team remains busy but business results stay weak.",
    metric: "Owner Dependency",
    value: 82,
  },
  {
    number: "03",
    title: "Cash Flow Leakage",
    description:
      "Delayed collections, uncontrolled credit and weak debtor tracking create continuous cash pressure.",
    metric: "Delayed Payments",
    value: 31,
  },
  {
    number: "04",
    title: "Process Leakage",
    description:
      "Without SOPs and repeatable processes, mistakes, delays and owner dependency continue every day.",
    metric: "Process Errors",
    value: 47,
  },
  {
    number: "05",
    title: "Profit Leakage",
    description:
      "Without product-wise gross profit and expense tracking, profit decisions remain based on assumptions.",
    metric: "Profit Leakage",
    value: 22,
  },
];

const dashboardMetrics = [
  {
    label: "Inventory Control",
    before: 42,
    after: 88,
  },
  {
    label: "Team Accountability",
    before: 36,
    after: 84,
  },
  {
    label: "Cash Flow Visibility",
    before: 48,
    after: 90,
  },
  {
    label: "Systemisation",
    before: 25,
    after: 86,
  },
  {
    label: "Profit Control",
    before: 39,
    after: 87,
  },
];

type AnimatedMetricProps = {
  label: string;
  before: number;
  after: number;
  progress: MotionValue<number>;
};

function AnimatedMetric({
  label,
  before,
  after,
  progress,
}: AnimatedMetricProps) {
  const animatedValue = useTransform(
    progress,
    [0, 1],
    [before, after],
  );

  const animatedWidth = useTransform(
    animatedValue,
    (value) => `${Math.round(value)}%`,
  );

  const [displayValue, setDisplayValue] = useState(before);

  useMotionValueEvent(animatedValue, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">{label}</p>

        <p className="text-sm font-bold text-[#1d4ed8]">
          {displayValue}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
        <motion.div
          style={{
            width: animatedWidth,
          }}
          className="h-full rounded-full bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6]"
        />
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-gray-600">
        <span>Before: {before}%</span>
        <span>Target: {after}%</span>
      </div>
    </div>
  );
}

type HealthScoreProps = {
  progress: MotionValue<number>;
};

function HealthScore({ progress }: HealthScoreProps) {
  const animatedScore = useTransform(progress, [0, 1], [39, 87]);
  const [score, setScore] = useState(39);

  useMotionValueEvent(animatedScore, "change", (latest) => {
    setScore(Math.round(latest));
  });

  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
        Current Health Score
      </p>

      <div className="mt-4 flex items-end justify-center gap-2">
        <span className="font-serif text-6xl font-bold text-[#22c55e]">
          {score}
        </span>

        <span className="pb-2 text-2xl text-gray-500">%</span>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Improving with systems and implementation
      </p>
    </div>
  );
}

export default function ProfitLeakDiagnostic() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      ref={sectionRef}
      id="profit-leak"
      className="relative overflow-visible border-y border-black/10 bg-white px-6 py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#3b82f6]/5 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.7,
            }}
            transition={{
              duration: 0.7,
            }}
            className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]"
          >
            Business Profit Leak Diagnostic
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
            viewport={{
              once: false,
              amount: 0.5,
            }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 font-serif text-4xl md:text-6xl"
          >
            Where Is Your Business

            <span className="mt-2 block text-[#1d4ed8]">
              Losing Profit Every Day?
            </span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.7,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600"
          >
            Scroll through the five major profit leaks that silently reduce
            cash flow, team productivity and business profitability.
          </motion.p>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          {/* LEFT SIDE PROFIT LEAKS */}

          <div className="space-y-24">
            {leakStages.map((stage, index) => (
              <motion.article
                key={stage.number}
                initial={{
                  opacity: 0,
                  x: -80,
                  y: 40,
                  filter: "blur(6px)",
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",
                }}
                viewport={{
                  once: false,
                  amount: 0.45,
                }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative min-h-[260px] overflow-hidden rounded-3xl border border-black/10 bg-black/[0.03] p-8 transition-colors duration-300 hover:border-[#3b82f6]/50 md:p-10"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#3b82f6]/0 blur-3xl transition duration-500 group-hover:bg-[#3b82f6]/12" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                        Profit Leak {stage.number}
                      </p>

                      <h3 className="mt-4 font-serif text-3xl md:text-4xl">
                        {stage.title}
                      </h3>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-lg font-bold text-[#22c55e]">
                      {stage.number}
                    </div>
                  </div>

                  <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                    {stage.description}
                  </p>

                  <div className="mt-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {stage.metric}
                      </span>

                      <span className="font-bold text-red-600">
                        {stage.value}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        whileInView={{
                          width: `${stage.value}%`,
                        }}
                        viewport={{
                          once: false,
                          amount: 0.7,
                        }}
                        transition={{
                          duration: 1,
                          delay: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6] transition-all duration-500 group-hover:w-full" />
              </motion.article>
            ))}
          </div>

          {/* RIGHT SIDE STICKY DASHBOARD */}

          <div className="relative">
            <div className="sticky top-28">
              <motion.div
                initial={{
                  opacity: 0,
                  x: 80,
                  scale: 0.95,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                viewport={{
                  once: false,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/10 to-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-9"
              >
                <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-80 -translate-x-1/2 bg-[#3b82f6]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6]">
                        Live Business Dashboard
                      </p>

                      <h3 className="mt-3 text-2xl font-bold">
                        Business Health Score
                      </h3>
                    </div>

                    <div className="rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-4 py-2 text-xs font-semibold text-[#22c55e]">
                      RPIANS Diagnostic
                    </div>
                  </div>

                  <HealthScore progress={smoothProgress} />

                  <div className="mt-8 space-y-6">
                    {dashboardMetrics.map((metric) => (
                      <AnimatedMetric
                        key={metric.label}
                        label={metric.label}
                        before={metric.before}
                        after={metric.after}
                        progress={smoothProgress}
                      />
                    ))}
                  </div>

                  <div className="mt-9 rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3b82f6]">
                      After RPIANS Implementation
                    </p>

                    <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                      {[
                        "Inventory Controlled",
                        "Team Accountable",
                        "Cash Flow Visible",
                        "Owner Dependency Reduced",
                        "Systems Implemented",
                        "Profit Growth Activated",
                      ].map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-xs text-[#22c55e]">
                            ✓
                          </span>

                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/register"
                    className="mt-8 block rounded-lg bg-gradient-to-r from-[#86efac] to-[#16a34a] px-8 py-4 text-center font-bold text-white transition hover:scale-[1.02]"
                  >
                    Get Your Business Diagnostic
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}