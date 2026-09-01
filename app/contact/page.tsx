import type { Metadata } from "next";

import AnimatedWords from "../AnimatedWords";
import Reveal from "../Reveal";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import TiltCard from "../TiltCard";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with the RPIANS team to discuss business automation, team accountability, inventory control and profit multiplication.",
};

const whatsappUrl =
  "https://wa.me/917389638105?text=Namaste%20RPIANS%20Team,%20mujhe%20Business%20Automation%20aur%20Profit%20Growth%20ke%20baare%20mein%20jankari%20chahiye.";

const contactCards = [
  {
    icon: "☎",
    title: "Call Our Team",
    text: "+91 73896 38105",
    href: "tel:+917389638105",
  },
  {
    icon: "💬",
    title: "WhatsApp Us",
    text: "Start Conversation",
    href: whatsappUrl,
  },
  {
    icon: "📋",
    title: "Apply for Strategy Call",
    text: "Complete Application",
    href: "/register",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />

      <div className="pt-20">
        {/* CONTACT */}

        <section
          id="contact"
          className="border-t border-white/10 bg-white/[0.02] px-6 py-24"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal direction="up" className="mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
                Contact RPIANS
              </p>

              <h2 className="mt-5 font-serif text-4xl md:text-6xl">
                <AnimatedWords
                  text="Let’s Discuss Your Business Growth"
                  stagger={0.09}
                  className="justify-center"
                />
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                Connect with the RPIANS team to discuss business automation, team
                accountability, inventory control and profit multiplication.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {contactCards.map((item, index) => (
                <Reveal
                  key={item.title}
                  direction="up"
                  delay={index * 0.12}
                  className="h-full"
                >
                  <TiltCard className="group h-full rounded-2xl border border-white/10 bg-black transition hover:border-[#d9a441]/50">
                    <a
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block h-full p-7 text-center"
                    >
                      <div className="text-3xl">{item.icon}</div>

                      <h3 className="mt-5 text-xl font-bold transition group-hover:text-[#edc66d]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[#d9a441]">{item.text}</p>
                    </a>
                  </TiltCard>
                </Reveal>
              ))}
            </div>

            <Reveal direction="up" delay={0.2}>
              <div className="mt-10 rounded-2xl border border-[#d9a441]/20 bg-[#d9a441]/5 p-7 text-center">
                <h3 className="text-xl font-bold">
                  RPIANS World Class Business Coaching LLP
                </h3>

                <p className="mt-3 text-gray-400">
                  Business Automation and Profit Coaching for Indian
                  Entrepreneurs
                </p>

                <p className="mt-2 text-gray-500">
                  Betul, Madhya Pradesh, India
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
