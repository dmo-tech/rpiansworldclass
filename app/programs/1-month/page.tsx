import type { Metadata } from "next";

import ProgramPageTemplate from "../../ProgramPageTemplate";

export const metadata: Metadata = {
  title: "1 Month Program",
  description:
    "A one-month implementation program to set up inventory, HR, cash-flow and dashboard systems in your business.",
};

export default function OneMonthProgramPage() {
  return (
    <ProgramPageTemplate
      eyebrow="Set Up the Core Systems Your Business Runs On"
      headingLine1={"One Month\nBusiness Automation And Profit"}
      headingLine2="Scaleup Program"
      // Sized so "Business Automation And Profit" stays on one line beside the photo from 1280px.
      headingClassName="text-[2rem] md:text-[2.75rem] lg:text-[1.75rem] xl:text-4xl"
      description="A structured one-month program to implement inventory control, team accountability, cash-flow tracking and dashboards, with weekly reviews and hands-on support."
      duration="1 Month"
      mode="Live Online Sessions + Weekly Reviews"
      audience="Business Owners Ready to Implement Systems"
      topics={[
        "Inventory Management Setup",
        "Team KRA and KPI Framework",
        "Cash Flow Tracking System",
        "Gross Profit Dashboard",
        "SOP Documentation",
        "Weekly Implementation Reviews",
      ]}
      ctaLabel="Register for the 1 Month Program"
      photoSrc="/rajesh-kumar-kare-1month.png"
      photoAlt="Rajesh Kumar Kare"
      planId="1-month"
    />
  );
}
