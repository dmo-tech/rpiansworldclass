import Link from "next/link";

import AnimatedCounter from "./AnimatedCounter";
import AnimatedWords from "./AnimatedWords";
import { watchVideoHref } from "./applyFlow";
import BeforeAfter from "./BeforeAfter";
import BusinessHealthQuiz from "./BusinessHealthQuiz";
import EnquireNowTab from "./EnquireNowTab";
import HomeVideoShowcase from "./HomeVideoShowcase";
import MouseGlow from "./MouseGlow";
import ProfitLeakDiagnostic from "./ProfitLeakDiagnostic";
import Reveal from "./Reveal";
import ScrollProgress from "./ScrollProgress";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import Testimonials from "./Testimonials";
import TiltCard from "./TiltCard";
import WatchApplyButton, { PlayCircleIcon } from "./WatchApplyButton";


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
    <main className="relative min-h-screen overflow-x-clip bg-white text-[#0f172a]">
      <ScrollProgress />
      <MouseGlow />

      {/* HEADER */}

      <SiteHeader />
      <EnquireNowTab from="Home - Enquire Now" />

      {/* HERO + VIDEO share one background, so there is no seam between them.
          Below md the hero is only as tall as its content and starts 24px under
          the 77px fixed header, so the video shows on the first screen. Sizes
          are the small end on purpose: half the video still clears the cookie
          banner on a first visit. */}

      <div className="luxury-background">
        <section
          id="home"
          className="relative pb-3 pt-[101px] md:flex md:min-h-[100dvh] md:flex-col md:justify-center md:pb-10 md:pt-28"
        >
          <div className="site-container relative z-10 max-md:px-4">
            <Reveal direction="up" className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#3b82f6] md:mb-6 md:tracking-[0.4em]">
                India’s Business Automation and Profit Coaching Movement
              </p>

              <h1 className="font-serif text-[26px] font-semibold leading-tight md:text-6xl">
                <AnimatedWords
                  text="Business Automation And"
                  stagger={0.12}
                  className="justify-center"
                />

                <span className="block md:mt-3">
                  <AnimatedWords
                    text="Profit Mastery Strategy"
                    delay={0.35}
                    stagger={0.14}
                    className="text-[#1d4ed8] justify-center"
                  />
                </span>
              </h1>

              <Reveal direction="up" delay={0.5}>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-[1.6] text-gray-600 md:mt-7 md:text-lg md:leading-8">
                  Run your business on autopilot mode, build an accountable
                  team, control inventory and cash flow, and multiply your
                  profit every year with proven business systems.
                </p>

                <div className="mt-4 flex justify-center md:mt-9">
                  {/* Straight to the video, without the "One Important Thing"
                      popup the other buttons open. `from` stays in the URL,
                      which the watch tracking saves. */}
                  <Link
                    href={watchVideoHref("Home - Hero")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-3 text-[15px] font-bold text-white! transition hover:scale-105 md:h-auto md:rounded-lg md:px-10 md:py-4 md:text-base"
                  >
                    <PlayCircleIcon />
                    <span className="text-balance text-center">
                      Watch Free Training Now
                    </span>
                  </Link>
                </div>
              </Reveal>
            </Reveal>
          </div>
        </section>

        {/* VIDEO */}

        <HomeVideoShowcase />
      </div>

      {/* STATS */}

      <section className="relative py-10 md:pb-20 md:pt-16">
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

      <BeforeAfter />

      <ProfitLeakDiagnostic />

      <BusinessHealthQuiz />

      {/* TESTIMONIALS */}

      <Reveal direction="up">
        <Testimonials />
      </Reveal>

      {/* MOVEMENT */}

      <section className="relative overflow-hidden border-y border-black/10 py-10 md:py-28">
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
            <WatchApplyButton
              from="Home - Movement"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-10 py-4 font-bold text-white! transition hover:scale-105 sm:w-auto"
            />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}

      <section className="border-y border-black/10 bg-black/[0.02] py-10 md:py-28">
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

      <section className="py-10 md:py-28">
        <Reveal direction="up" className="site-container">
          <div className="rounded-3xl border border-black/10 px-7 py-10 text-center md:py-20">
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
              <WatchApplyButton
                from="Home"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-10 py-4 font-bold text-white! transition hover:scale-105 sm:w-auto"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}

      <SiteFooter />
    </main>
  );
}