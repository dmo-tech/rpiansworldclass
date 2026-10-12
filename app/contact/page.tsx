import Link from "next/link";
import type { ReactNode } from "react";

import Reveal from "../Reveal";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import { CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from "../siteConfig";
import { SOCIAL_LINKS, WHATSAPP_ICON_PATH } from "../socialLinks";
import WatchApplyButton from "../WatchApplyButton";

const CONTACT_EMAIL = "info@worldclassbc.com";

// Instagram, Facebook and X, the same profiles as the footer icons.
const FOLLOW_LINKS = SOCIAL_LINKS.filter((social) =>
  ["Instagram", "Facebook", "X (Twitter)"].includes(social.label),
);

const cardClass =
  "flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]";

// Links need text-…! colours: globals.css sets `a { color: inherit }`.
const valueLinkClass = "transition hover:text-[#3b82f6]!";

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6]/10 text-[#3b82f6]">
      {children}
    </span>
  );
}

const strokeIcon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "h-5 w-5",
};

function PhoneIcon() {
  return (
    <svg {...strokeIcon}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...strokeIcon}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d={WHATSAPP_ICON_PATH} />
    </svg>
  );
}

const reachUs = [
  {
    label: "Mobile",
    value: CONTACT_PHONE,
    href: CONTACT_PHONE_TEL,
    icon: <PhoneIcon />,
  },
  {
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: WHATSAPP_URL,
    external: true,
    icon: <WhatsAppIcon />,
  },
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    icon: <MailIcon />,
  },
];

const aboutUs = [
  { label: "Company", value: "RPIANS World Class Business Coaching LLP" },
  { label: "Founder", value: "Rajesh Kumar Kare" },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-[#0f172a]">
      <SiteHeader />

      <div className="pt-20">
        <section className="py-16 md:py-24">
          <div className="site-container">
            <div className="mx-auto max-w-5xl">
              <Reveal direction="up" className="text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
                  Get In Touch
                </p>

                <h1 className="mt-5 font-serif text-4xl md:text-6xl">
                  Contact Details
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-8 text-gray-600">
                  For more information about our Business Automation and Profit
                  Mastery programs, reach out to us.
                </p>
              </Reveal>

              {/* Equal-height cards: each Reveal and card fills the grid row,
                  and both start with their title at the same height. */}
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <Reveal direction="up" className="h-full">
                  <div className={cardClass}>
                    <h2 className="font-serif text-2xl font-bold">Reach Us</h2>

                    <ul className="mt-6 space-y-6 border-t border-black/10 pt-6">
                      {reachUs.map((item) => (
                        <li key={item.label} className="flex items-center gap-4">
                          <IconBadge>{item.icon}</IconBadge>

                          <div className="min-w-0">
                            <p className={labelClass}>{item.label}</p>

                            <a
                              href={item.href}
                              {...(item.external
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className={`mt-1 block break-words text-lg font-bold ${valueLinkClass}`}
                            >
                              {item.value}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal direction="up" delay={0.1} className="h-full">
                  <div className={cardClass}>
                    <h2 className="font-serif text-2xl font-bold">About Us</h2>

                    <dl className="mt-6 space-y-6 border-t border-black/10 pt-6">
                      {aboutUs.map((item) => (
                        <div key={item.label}>
                          <dt className={labelClass}>{item.label}</dt>
                          <dd className="mt-1 text-lg font-bold">{item.value}</dd>
                        </div>
                      ))}

                      <div>
                        <dt className={labelClass}>Website</dt>
                        <dd className="mt-1 text-lg font-bold">
                          <Link href="/" className={valueLinkClass}>
                            worldclassbc.com
                          </Link>
                        </dd>
                      </div>

                      <div>
                        <dt className={labelClass}>Follow Us</dt>
                        <dd className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                          {FOLLOW_LINKS.map((social) => (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2.5 font-semibold ${valueLinkClass}`}
                            >
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-[0_6px_16px_rgba(15,23,42,0.18)] ${social.brand}`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                >
                                  <path d={social.path} />
                                </svg>
                              </span>
                              {social.label}
                            </a>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Reveal>
              </div>

              <Reveal direction="up" delay={0.15} className="mt-12 flex justify-center">
                {/* One line from sm up with ▶ right next to the text; on phones
                    two even lines that still hug the icon. */}
                <WatchApplyButton
                  from="Contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-8 py-4 font-bold text-white! shadow-[0_15px_50px_rgba(59,130,246,0.22)] transition hover:scale-105"
                >
                  <span className="block sm:inline">Start Your Business</span>{" "}
                  <span className="block sm:inline">Transformation Today</span>
                </WatchApplyButton>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
