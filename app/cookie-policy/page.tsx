import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import CookieSettingsButton from "../CookieSettingsButton";
import Reveal from "../Reveal";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "../siteConfig";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies RPIANS World Class Business Coaching uses, why, and how to change your choice.",
  alternates: { canonical: "/cookie-policy" },
};

type CookieRow = {
  name: string;
  purpose: string;
  duration: string;
  setBy: string;
};

// Keep in step with what the site really stores: essential storage in the
// components, analytics / marketing tools in trackingScripts.tsx.
const ESSENTIAL_COOKIES: CookieRow[] = [
  {
    name: "cookie_consent",
    purpose:
      "Remembers your cookie choice, so we don't ask again on every page.",
    duration: "6 months",
    setBy: "RPIANS (this website)",
  },
  {
    name: "rpiansVideoViewer, rpiansVideoProgress… (browser storage)",
    purpose:
      "Remembers where you stopped in the training video, so you can resume, and the details you entered to book a call, so the form is filled in next time and your viewing is linked to them.",
    duration: "Until you clear your browser data",
    setBy: "RPIANS (this website)",
  },
  {
    name: "rpiansWatchBookCallUnlocked (browser storage)",
    purpose:
      "Remembers that you watched enough of the video to book a call.",
    duration: "Until you clear your browser data",
    setBy: "RPIANS (this website)",
  },
  {
    name: "rpiansApplicationData, rpiansPaymentReceipt (browser storage)",
    purpose:
      "Carries the details from your form to the payment page, and shows your receipt after payment.",
    duration: "Deleted when you close the tab",
    setBy: "RPIANS (this website)",
  },
  {
    name: "Razorpay checkout",
    purpose:
      "When you pay, Razorpay may set its own cookies to process the payment safely and prevent fraud. Every payment is also checked on our server.",
    duration: "Set by Razorpay (see Razorpay's privacy policy)",
    setBy: "Razorpay",
  },
  {
    name: "Login",
    purpose:
      "Member login is not live yet. When it is, a secure cookie will keep you signed in, and it will be used only for that.",
    duration: "Until you log out or the session ends",
    setBy: "RPIANS (this website)",
  },
];

const ANALYTICS_COOKIES: CookieRow[] = [
  {
    name: "_ga, _ga_<ID>",
    purpose:
      "Google Analytics: counts visits and pages seen, and tells one visitor from another without knowing who you are.",
    duration: "Up to 2 years",
    setBy: "Google",
  },
  {
    name: "_clck, _clsk",
    purpose:
      "Microsoft Clarity: shows how pages are used (clicks, scrolling) so we can fix confusing parts.",
    duration: "_clck up to 1 year, _clsk 1 day",
    setBy: "Microsoft",
  },
];

const MARKETING_COOKIES: CookieRow[] = [
  {
    name: "_fbp, _fbc",
    purpose:
      "Meta Pixel: measures our Facebook and Instagram ads and helps show our ads to people who visited the site.",
    duration: "Up to 3 months",
    setBy: "Meta (Facebook / Instagram)",
  },
  {
    name: "_gcl_au and other _gcl_ cookies",
    purpose:
      "Google Ads: measures which Google ads led to a sign-up or payment.",
    duration: "Up to 3 months",
    setBy: "Google",
  },
];

function CookieList({ rows }: { rows: CookieRow[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {rows.map((row) => (
        <li
          key={row.name}
          className="rounded-xl border border-black/10 bg-[#f8fafc] p-4 leading-6"
        >
          <p className="break-words font-bold text-[#0f172a]">{row.name}</p>

          <p className="mt-1.5 font-medium">{row.purpose}</p>

          <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div>
              <dt className="inline text-gray-500">How long: </dt>
              <dd className="inline font-medium text-[#0f172a]">
                {row.duration}
              </dd>
            </div>

            <div>
              <dt className="inline text-gray-500">Set by: </dt>
              <dd className="inline font-medium text-[#0f172a]">
                {row.setBy}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export default function CookiePolicyPage() {
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
          Legal Information
        </p>

        <h1 className="mt-5 font-serif text-4xl md:text-6xl">Cookie Policy</h1>

        <p className="mt-5 text-gray-600">Last Updated: 14 October 2026</p>

        <p className="mt-6 max-w-3xl font-medium leading-8 text-gray-600">
          This page explains which cookies we use on worldclassbc.com, what
          each one does, and how you can change your choice at any time.
        </p>

        <CookieSettingsButton className="mt-6 rounded-lg border border-[#3b82f6]/60 px-6 py-3 text-sm font-bold text-[#1d4ed8] transition hover:bg-[#3b82f6]/10">
          Change Cookie Settings
        </CookieSettingsButton>

        <div className="mt-12 space-y-10 leading-8 text-gray-600">
          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                1. What Are Cookies?
              </h2>

              <p className="mt-4">
                Cookies are small text files that a website saves in your
                browser. Some are needed for the website to work. Others help
                us understand how people use the website, or measure our ads.
              </p>

              <p className="mt-4">
                For a few essential features we also use your browser&rsquo;s
                own storage (called local storage and session storage). It
                works like a cookie, so we list it on this page too.
              </p>
            </section>
          </Reveal>

          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                2. Your Choice
              </h2>

              <p className="mt-4">
                On your first visit, a banner at the bottom of the page lets
                you choose <strong>Accept All</strong>,{" "}
                <strong>Reject Non-Essential</strong> or{" "}
                <strong>Customize</strong>.
              </p>

              <ul className="mt-4 list-disc space-y-1 list-inside">
                <li>
                  Analytics and marketing tools do not load until you allow
                  them.
                </li>
                <li>
                  We save your choice in a cookie called{" "}
                  <strong>cookie_consent</strong> for 6 months. After that we
                  ask again.
                </li>
                <li>
                  You can change your choice at any time with &ldquo;Cookie
                  Settings&rdquo; at the bottom of the website, or the
                  &ldquo;Change Cookie Settings&rdquo; button on this page.
                </li>
                <li>
                  If you turn a category off, we delete its cookies from our
                  website and reload the page without those tools.
                </li>
              </ul>
            </section>
          </Reveal>

          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                3. Essential Cookies (Always On)
              </h2>

              <p className="mt-4">
                These are needed for login, secure payments, our forms and
                the training video. They do not track you for ads, and they
                can&rsquo;t be turned off.
              </p>

              <CookieList rows={ESSENTIAL_COOKIES} />
            </section>
          </Reveal>

          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                4. Analytics Cookies (Only If You Allow Them)
              </h2>

              <p className="mt-4">
                These help us understand how visitors find and use the
                website, so we can make it better. They are used only if you
                turn on &ldquo;Analytics&rdquo;.
              </p>

              <CookieList rows={ANALYTICS_COOKIES} />
            </section>
          </Reveal>

          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                5. Marketing Cookies (Only If You Allow Them)
              </h2>

              <p className="mt-4">
                These measure how our ads perform and help show our ads to
                people who have visited our website. They are used only if
                you turn on &ldquo;Marketing&rdquo;.
              </p>

              <CookieList rows={MARKETING_COOKIES} />
            </section>
          </Reveal>

          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                6. Controlling Cookies in Your Browser
              </h2>

              <p className="mt-4">
                You can also block or delete cookies in your browser settings.
                If you block essential cookies or browser storage, some parts
                of the website (such as resuming the video or the payment
                page) may not work properly.
              </p>
            </section>
          </Reveal>

          <Reveal direction="up">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                7. More Information
              </h2>

              <p className="mt-4">
                To learn how we handle your personal information, read our{" "}
                <Link href="/privacy-policy" className="text-[#3b82f6]!">
                  Privacy Policy
                </Link>
                . We may update this Cookie Policy when we add or remove a
                tool; the date at the top shows the latest change.
              </p>

              <p className="mt-4">For any questions about cookies, contact us:</p>

              <p className="mt-4">RPIANS World Class Business Coaching LLP</p>
              <p>
                Email:{" "}
                <a href="mailto:info@worldclassbc.com" className="text-[#3b82f6]!">
                  info@worldclassbc.com
                </a>
              </p>
              <p>
                Contact Number:{" "}
                <a href={CONTACT_PHONE_TEL} className="text-[#3b82f6]!">
                  {CONTACT_PHONE}
                </a>
              </p>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
