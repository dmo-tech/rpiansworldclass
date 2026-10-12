import Image from "next/image";
import Link from "next/link";

import { CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from "./siteConfig";
import { SOCIAL_LINKS } from "./socialLinks";
import WatchApplyButton from "./WatchApplyButton";
import WhatsAppChat from "./WhatsAppChat";

const CONTACT_EMAIL = "info@worldclassbc.com";

const programLinks = [
  { href: "/programs/1-day", label: "1 Day Program" },
  { href: "/programs/1-month", label: "1 Month Program" },
  { href: "/programs/10-month", label: "10 Month Program" },
  { href: "/programs/personal-mentorship", label: "Personal Mentorship" },
  { href: "/register?plan=strategy-call", label: "Book a Strategy Call" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/systems", label: "Systems" },
  { href: "/results", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

// Links inherit the column's gray (globals.css sets `a { color: inherit }`),
// so only the hover colour needs the important modifier.
const linkClass = "transition-colors duration-200 hover:text-white!";

const headingClass =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-[#60a5fa]";

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className={headingClass}>{title}</h3>

      <ul className="mt-3.5 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function SiteFooter() {
  return (
    <>
      <footer className="relative flex flex-1 flex-col bg-[#0b1220] text-sm font-medium text-gray-400">
        <div
          aria-hidden="true"
          className="h-[3px] bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa]"
        />

        <div className="site-container flex-1 py-8 lg:py-10">
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/rpians-logo.png"
                    alt="RPIANS logo"
                    width={44}
                    height={33}
                    className="h-auto w-full"
                  />
                </span>

                <span>
                  <span className="block text-base font-bold tracking-[0.28em] text-white">
                    RPIANS
                  </span>

                  <span className="block text-[8.5px] uppercase tracking-[0.2em] text-gray-400">
                    World Class Business Coaching
                  </span>
                </span>
              </Link>

              <p className="mt-4 max-w-xs leading-6">
                Helping Indian entrepreneurs build profitable, system-driven,
                autopilot businesses.
              </p>

              <div className="mt-4 flex gap-2.5 text-gray-300">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-white! shadow-[0_6px_16px_rgba(0,0,0,0.35)] ring-2 ring-white/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] hover:ring-white/40 ${social.brand}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-4 w-4"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <FooterLinks title="Programs" links={programLinks} />

            <FooterLinks title="Quick Links" links={quickLinks} />

            <div>
              <h3 className={headingClass}>Get in Touch</h3>

              <ul className="mt-3.5 space-y-2.5">
                <li>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                    Email
                  </p>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className={`mt-0.5 inline-block break-all text-gray-200! ${linkClass}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>

                <li>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                    Phone / WhatsApp
                  </p>

                  <a
                    href={CONTACT_PHONE_TEL}
                    className={`mt-0.5 inline-block text-gray-200! ${linkClass}`}
                  >
                    {CONTACT_PHONE}
                  </a>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-xs font-semibold text-[#4ade80]! transition-colors duration-200 hover:text-white!"
                  >
                    Chat on WhatsApp →
                  </a>
                </li>
              </ul>

              <WatchApplyButton
                from="Footer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-5 py-2.5 text-sm font-bold text-white! shadow-[0_10px_24px_rgba(37,99,235,0.35)] transition hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          {/* The right padding below 1400px keeps the bar clear of the floating
              WhatsApp and back-to-top buttons in the bottom-right corner. */}
          <div className="site-container">
            <div className="flex flex-col gap-2 py-4 pr-20 text-xs text-gray-500 md:pr-24 lg:flex-row lg:items-center lg:justify-between min-[1400px]:pr-0">
              <p>
                © 2026 RPIANS World Class Business Coaching LLP. All Rights
                Reserved.
              </p>

              <nav
                aria-label="Legal"
                className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-3"
              >
                {legalLinks.map((link, index) => (
                  <span key={link.href} className="flex items-center gap-3">
                    {/* No dots on phones, where the links wrap onto two lines. */}
                    {index > 0 && (
                      <span aria-hidden="true" className="hidden sm:inline">
                        ·
                      </span>
                    )}

                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppChat href={WHATSAPP_URL} />
    </>
  );
}
