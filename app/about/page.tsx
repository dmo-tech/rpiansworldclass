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
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />

      <div className="pt-20">
        {/* ABOUT */}

        <section id="about" className="px-6 py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="relative h-[560px] overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-neutral-900">
                <ParallaxImage
                  src="/rajesh-kumar-kare.jpg"
                  alt="Rajesh Kumar Kare"
                  className="object-top"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/80 to-transparent p-8 pt-28">
                  <h3 className="text-2xl font-bold text-white">Rajesh Kumar Kare</h3>

                  <p className="mt-2 text-[#3b82f6]">
                    TEDx Speaker | Business Automation & Profit Coach
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.15}>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
                  Your Business Growth Advisor
                </p>

                <h2 className="mt-5 font-serif text-4xl text-[#1d4ed8] md:text-5xl">
                  <AnimatedWords
                    text="Rajesh Kumar Kare"
                    stagger={0.12}
                    className="justify-start"
                  />
                </h2>

                <p className="mt-3 text-lg text-gray-600">
                  TEDx Speaker | Business Automation & Profit Coach
                </p>

                <p className="mt-7 leading-8 text-gray-600">
                  I am Rajesh Kumar Kare, India&rsquo;s first Business
                  Automation and Profit Coach. I have been running my own
                  business for the past 21 years. I built my business from
                  scratch, and over the last five years, I have helped
                  hundreds of business owners transition their operations to
                  &ldquo;autopilot mode&rdquo; and multiply their profits.
                </p>

                <p className="mt-5 leading-8 text-gray-600">
                  I have personally experienced the challenges of cash flow
                  pressure, blocked inventory, over-reliance on the team, the
                  daily grind of &ldquo;firefighting,&rdquo; and the stress
                  that comes with being an owner. That is why I have
                  dedicated my life to helping business owners.
                </p>

                <ApplyButton className="mt-9 inline-block rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-9 py-4 font-bold text-white transition hover:scale-105">
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
