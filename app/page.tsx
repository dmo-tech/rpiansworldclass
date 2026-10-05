import Link from "next/link";

import AnimatedCounter from "./AnimatedCounter";
import AnimatedWords from "./AnimatedWords";
import ApplyButton from "./ApplyButton";
import BeforeAfter from "./BeforeAfter";
import BookCallButton from "./BookCallButton";
import BusinessHealthQuiz from "./BusinessHealthQuiz";
import MouseGlow from "./MouseGlow";
import ProfitLeakDiagnostic from "./ProfitLeakDiagnostic";
import Reveal from "./Reveal";
import ScrollProgress from "./ScrollProgress";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import Testimonials from "./Testimonials";
import TiltCard from "./TiltCard";


const stats = [
  {
    number: 100,
    suffix: "+",
    title: "Business Success Stories",
    text: "Business owners transformed through systems, automation and implementation.",
  },
  {
    number: 21,
    suffix: "+",
    title: "Years of Business Experience",
    text: "Real-world experience in business growth, automation and profitability.",
  },
  {
    number: 1,
    suffix: " Crore+",
    title: "Entrepreneurs Mission",
    text: "Our mission is to empower Indian entrepreneurs by the year 2035.",
  },
];

const faqs = [
  {
    question: "Who is this program for?",
    answer:
      "This program is designed for serious retailers, wholesalers, manufacturers, distributors, construction businesses, service businesses and project-based business owners.",
  },
  {
    question: "Will my team also receive training?",
    answer:
      "Yes. Team training, accountability systems, KRA, KPI and implementation support are provided according to the selected program.",
  },
  {
    question: "How does RPIANS help automate a business?",
    answer:
      "We help implement inventory systems, HR systems, SOPs, dashboards, cash-flow controls, working-capital systems and AI-driven automation.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Implementation time depends on the size, complexity and readiness of the business. The process is implemented step-by-step with reviews and hand-holding.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <ScrollProgress />
      <MouseGlow />

      {/* HEADER */}

      <SiteHeader />

      {/* HERO */}

      <section
        id="home"
        className="luxury-background relative flex min-h-[100dvh] flex-col justify-center pb-10 pt-24 md:pt-28"
      >
        <div className="site-container relative z-10">
          <Reveal direction="up" className="text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6] md:mb-6 md:tracking-[0.4em]">
              India’s Business Automation and Profit Coaching Movement
            </p>

            <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              <AnimatedWords
                text="Business Automation And"
                stagger={0.12}
                className="justify-center"
              />

              <span className="mt-2 block md:mt-3">
                <AnimatedWords
                  text="Profit Mastery Strategy"
                  delay={0.35}
                  stagger={0.14}
                  className="text-[#1d4ed8] justify-center"
                />
              </span>
            </h1>

            <Reveal direction="up" delay={0.5}>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base md:mt-7 md:text-lg md:leading-8">
                Run your business on autopilot mode, build an accountable
                team, control inventory and cash flow, and multiply your
                profit every year with proven business systems.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.65}>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:mt-10">
                <ApplyButton className="w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-9 py-3 text-sm font-bold text-white transition hover:scale-105 sm:w-auto md:py-4 md:text-base">
                  Apply to Work With Us
                </ApplyButton>

                <a
                  href="#video"
                  className="w-full rounded-lg border border-[#3b82f6]/60 px-9 py-3 text-center text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6]/10 sm:w-auto md:py-4 md:text-base"
                >
                  Watch the Transformation
                </a>
              </div>

              <Link
                href={`/book-call?from=${encodeURIComponent("Home - Hero")}`}
                className="mt-4 inline-block text-sm font-semibold text-[#1d4ed8] underline-offset-4 hover:underline md:mt-5"
              >
                Not ready to apply? Book a call →
              </Link>
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* STATS */}

      <section className="relative pb-20 pt-12 md:pt-16">
        <div className="site-container relative z-10">
          <div className="grid gap-5 text-left md:grid-cols-3">
            {stats.map((item, index) => (
              <Reveal
                key={item.title}
                direction="up"
                delay={index * 0.15}
                className="h-full"
              >
                <TiltCard className="group relative h-full overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] p-7 backdrop-blur transition-colors duration-300 hover:border-[#3b82f6]/50">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#3b82f6]/0 blur-3xl transition duration-500 group-hover:bg-[#3b82f6]/15" />

                  <AnimatedCounter
                    value={item.number}
                    suffix={item.suffix}
                    className="relative z-10 text-3xl font-bold text-[#3b82f6]"
                  />

                  <h2 className="relative z-10 mt-3 text-lg font-semibold">
                    {item.title}
                  </h2>

                  <p className="relative z-10 mt-3 text-sm leading-6 text-gray-600">
                    {item.text}
                  </p>

                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6] transition-all duration-500 group-hover:w-full" />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}

      <section id="video" className="py-24">
        <Reveal direction="up" className="site-container text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
            Discover the RPIANS System
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-6xl">
            <AnimatedWords
              text="Watch How Business Owners"
              stagger={0.09}
              className="justify-center"
            />

            <span className="mt-2 block text-[#1d4ed8]">
              <AnimatedWords
                text="Transform Their Business"
                delay={0.25}
                stagger={0.1}
                className="justify-center"
              />
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Learn how systems, dashboards, accountability and implementation
            can convert an owner-dependent business into a system-driven
            organisation.
          </p>

          <Reveal direction="up" delay={0.25}>
            <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-neutral-900">
              <div className="flex aspect-video items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-3xl text-white">
                    ▶
                  </div>

                  <p className="mt-5 text-sm text-gray-600">
                    RPIANS transformation video will be added here.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Reveal>
      </section>

      <BeforeAfter />

      <ProfitLeakDiagnostic />

      <BusinessHealthQuiz />

      {/* TESTIMONIALS */}

      <Reveal direction="up">
        <Testimonials />
      </Reveal>

      {/* MOVEMENT */}

      <section className="relative overflow-hidden border-y border-black/10 py-28">
        <Reveal
          direction="up"
          className="site-container relative text-center"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
            The RPIANS Movement
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-6xl">
            <AnimatedWords
              text="Join the Top 1% System-Driven Entrepreneurs"
              stagger={0.08}
              className="justify-center"
            />
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-600">
            Move from daily firefighting to structured growth. Build systems,
            strengthen leadership and multiply business profit.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ApplyButton className="w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-10 py-4 font-bold text-white transition hover:scale-105 sm:w-auto">
              Apply to Work With Us
            </ApplyButton>

            <BookCallButton from="Home - Movement" />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}

      <section className="border-y border-black/10 bg-black/[0.02] py-28">
        <div className="site-container">
          <Reveal direction="up" className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-5 font-serif text-4xl md:text-6xl">
              <AnimatedWords
                text="Questions Business Owners Ask"
                stagger={0.09}
                className="justify-center"
              />
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <Reveal
                key={faq.question}
                direction="up"
                delay={index * 0.1}
              >
                <details className="group rounded-xl border border-black/10 bg-white p-6 open:border-[#3b82f6]/40">
                  <summary className="cursor-pointer list-none text-lg font-semibold">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question}

                      <span className="text-2xl text-[#3b82f6] transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>

                  <p className="mt-5 leading-7 text-gray-600">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="py-28">
        <Reveal direction="up" className="site-container">
          <div className="rounded-3xl border border-black/10 px-7 py-20 text-center">
            <h2 className="font-serif text-4xl md:text-6xl">
              <AnimatedWords
                text="Ready to Build a System-Driven Business?"
                stagger={0.08}
                className="justify-center"
              />
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Move from daily chaos to structure, automation, accountability
              and sustainable profit growth.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ApplyButton className="w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-10 py-4 font-bold text-white transition hover:scale-105 sm:w-auto">
                Apply Now
              </ApplyButton>

              <BookCallButton from="Home - Final CTA" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}

      <SiteFooter />
    </main>
  );
}