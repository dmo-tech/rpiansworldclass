import type { Metadata } from "next";

import ProgramPageTemplate from "../../ProgramPageTemplate";
import { formatInr, plans } from "../../plans";
import { WHATSAPP_BASE_URL } from "../../siteConfig";

export const metadata: Metadata = {
  title: "10 Month Program",
  description:
    "A 10-month business transformation mentorship program covering full-scale automation, leadership and profit multiplication.",
};

// The price comes from plans.ts (it includes GST), so it always matches checkout.
const PRICE = formatInr(plans.find((plan) => plan.id === "10-month")?.amount ?? 0);

const MORE_INFO_URL = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
  `Hi RPIANS Team, I want more info about the 10 Month Business Automation & Profit Mastery Program (${PRICE}).`,
)}`;

const HIGHLIGHTS = [
  "Customized Small Group Mentorship to accelerate business growth, automate operations, and multiply profits.",
  "Complete Implementation Hand-Holding for Inventory Management, HRMS, Cash Flow, Profit Multiplication, and Business Automation Systems.",
];

function TenMonthOffer() {
  return (
    <div className="mx-auto mt-8 max-w-xl lg:mx-0">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6]">
        Small Group Mentorship
      </p>

      <h2 className="mt-2 text-2xl font-bold text-[#0f172a] md:text-3xl">
        Business Automation &amp; Profit Mastery
      </h2>

      <ul className="mt-6 space-y-4 text-left">
        {HIGHLIGHTS.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-lg leading-7">
              ✅
            </span>

            <span className="text-base leading-7 text-gray-700 md:text-lg md:leading-8">
              {highlight}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 font-serif text-4xl font-bold text-[#0f172a] md:text-5xl">
        {PRICE}.00
      </p>

      <p className="mt-1 text-sm text-gray-500">Including GST</p>

      <a
        href={MORE_INFO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#f97316] px-8 py-4 text-base font-bold tracking-wide text-white! shadow-[0_14px_34px_rgba(249,115,22,0.35)] transition hover:bg-[#ea580c] sm:w-auto"
      >
        YES! I WANT MORE INFO
      </a>
    </div>
  );
}

export default function TenMonthProgramPage() {
  return (
    <ProgramPageTemplate
      eyebrow="Build a Fully System-Driven Business"
      headingLine1="10 Month Business Automation And"
      headingLine2="Mastery Program"
      heroContent={<TenMonthOffer />}
      duration="10 Months"
      mode="Live Online Mentorship + Monthly Reviews"
      audience="Business Owners Ready for Full Transformation"
      topics={[
        "Complete Business Automation",
        "Leadership and Team Development",
        "Advanced Inventory and Cash Systems",
        "Profit Multiplication Strategy",
        "Business Dashboards and AI Tools",
        "Owner Freedom Roadmap",
      ]}
      ctaLabel="Register for the 10 Month Program"
      photoSrc="/rajesh-kumar-kare-10month.png"
      photoAlt="Rajesh Kumar Kare"
      planId="10-month"
    />
  );
}
