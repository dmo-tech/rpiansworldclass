import Image from "next/image";
import Link from "next/link";

import Reveal from "../Reveal";
import { WHATSAPP_URL } from "../siteConfig";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20 text-[#0f172a]">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/rpians-logo.png"
            alt="RPIANS logo"
            width={32}
            height={24}
            className="h-7 w-auto"
          />
          <span className="text-[#3b82f6]">← Return to Home</span>
        </Link>

        <p className="mt-12 text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
          Get In Touch
        </p>

        <h1 className="mt-5 font-serif text-4xl md:text-6xl">
          Contact Details
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal direction="up">
            <div className="h-full rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="leading-7 text-gray-600">
                For more information about our Business Automation and
                Profit Mastery programs, reach out to us:
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                Mobile / WhatsApp
              </p>

              <p className="mt-2 text-xl font-bold">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3b82f6]"
                >
                  +91 70495 61975
                </a>
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                Or, Email
              </p>

              <p className="mt-2 text-xl font-bold">
                <a
                  href="mailto:info@worldclassbc.com"
                  className="hover:text-[#3b82f6]"
                >
                  info@worldclassbc.com
                </a>
              </p>

              <a
                href="/book-call"
                className="mt-8 inline-block rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-3 font-bold text-white transition hover:scale-105"
              >
                Book a Call
              </a>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <div className="h-full rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                Company
              </p>

              <p className="mt-2 text-xl font-bold">
                RPIANS World Class Business Coaching LLP
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                Founder
              </p>

              <p className="mt-2 text-xl font-bold">Rajesh Kumar Kare</p>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
