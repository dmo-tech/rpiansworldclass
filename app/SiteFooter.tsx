import Image from "next/image";
import Link from "next/link";

import BookCallButton from "./BookCallButton";
import { CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from "./siteConfig";
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
  { href: "/journey", label: "Journey" },
  { href: "/results", label: "Results" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/worldclass_104?stkn=MXVnMWVnY3QyczV0cg==",
    label: "Instagram",
    brand: "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285aeb_90%)]",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.3-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.1.3-.3.9-.3 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.3 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.1.9.3 1.9.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.3.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.1-.3.3-.9.3-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.3-1.9-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.1-.9-.3-1.9-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm5.7-2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z",
  },
  {
    href: "https://www.linkedin.com/in/rajesh-kumar-kare?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    label: "LinkedIn",
    brand: "bg-[#0a66c2]",
    path: "M20.4 20.4h-3.5v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9.5V9h3.4v1.6h.05c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.15 2.3 4.15 5.3v6.3zM5.3 7.4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM7 20.4H3.6V9H7v11.4z",
  },
  {
    href: "https://www.facebook.com/share/1G9F9aoJEz/",
    label: "Facebook",
    brand: "bg-[#1877f2]",
    path: "M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.5 3 14.4 3c-2.4 0-4 1.5-4 4.1v2.6H7.7v3.2h2.7V21h3.1z",
  },
  {
    href: "https://youtube.com/@businessbyrajesh?si=Lw5O9Z-hTf8KdLIP",
    label: "YouTube",
    brand: "bg-[#ff0000]",
    path: "M21.6 7.2c-.2-1-1-1.7-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3c-1 .2-1.7 1-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8c.2 1 1 1.7 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3c1-.2 1.7-1 1.9-1.9.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z",
  },
];

// Links inherit the column's gray (globals.css sets `a { color: inherit }`),
// so only the hover colour needs the important modifier.
const linkClass = "transition-colors duration-200 hover:text-white!";

const headingClass =
  "text-xs font-semibold uppercase tracking-[0.25em] text-[#60a5fa]";

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

      <ul className="mt-5 space-y-3">
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
      <footer className="relative bg-[#0b1220] text-sm font-medium text-gray-400">
        <div
          aria-hidden="true"
          className="h-[3px] bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa]"
        />

        <div className="site-container py-14 lg:py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/rpians-logo.png"
                    alt="RPIANS logo"
                    width={44}
                    height={33}
                    className="h-auto w-full"
                  />
                </span>

                <span>
                  <span className="block text-xl font-bold tracking-[0.28em] text-white">
                    RPIANS
                  </span>

                  <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    World Class Business Coaching
                  </span>
                </span>
              </Link>

              <p className="mt-6 max-w-xs leading-7">
                Helping Indian entrepreneurs build profitable, system-driven,
                autopilot businesses.
              </p>

              <div className="mt-6 flex gap-3 text-gray-300">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-white! shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-2 ring-white/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] hover:ring-white/40 ${social.brand}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5"
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

              <ul className="mt-5 space-y-4">
                <li>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Email
                  </p>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className={`mt-1 inline-block break-all text-gray-200! ${linkClass}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>

                <li>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Phone / WhatsApp
                  </p>

                  <a
                    href={CONTACT_PHONE_TEL}
                    className={`mt-1 inline-block text-gray-200! ${linkClass}`}
                  >
                    {CONTACT_PHONE}
                  </a>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs font-semibold text-[#4ade80]! transition-colors duration-200 hover:text-white!"
                  >
                    Chat on WhatsApp →
                  </a>
                </li>
              </ul>

              <BookCallButton
                from="Footer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-3 font-bold text-white! shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          {/* The right padding below 1400px keeps the bar clear of the floating
              WhatsApp and back-to-top buttons in the bottom-right corner. */}
          <div className="site-container">
            <div className="flex flex-col gap-3 py-6 pr-20 text-xs text-gray-500 sm:text-sm md:pr-24 lg:flex-row lg:items-center lg:justify-between min-[1400px]:pr-0">
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
