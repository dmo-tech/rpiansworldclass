import type { Metadata } from "next";

import ProgramOffer from "../../ProgramOffer";
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
    <ProgramOffer
      label="Small Group Mentorship"
      title="Business Automation & Profit Mastery"
      highlights={HIGHLIGHTS}
      price={`${PRICE}.00`}
      priceNote="Including GST"
      moreInfoUrl={MORE_INFO_URL}
    />
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
