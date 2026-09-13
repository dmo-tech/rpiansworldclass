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
      eyebrow="1 Month Business Systems Implementation"
      headingLine1="Set Up the Core Systems"
      headingLine2="Your Business Runs On"
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
    />
  );
}
