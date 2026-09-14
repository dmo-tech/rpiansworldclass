import type { Metadata } from "next";

import ProgramPageTemplate from "../../ProgramPageTemplate";

export const metadata: Metadata = {
  title: "1 Day Program",
  description:
    "A one-day business automation workshop covering inventory, team accountability, cash flow and profit systems.",
};

export default function OneDayProgramPage() {
  return (
    <ProgramPageTemplate
      eyebrow="One Day Business Automation And Profit Accelerator"
      headingLine1="Fix Your Biggest"
      headingLine2="Business Bottleneck in a Day"
      headingClassName="text-xs"
      description="A focused one-day session to identify where your business is leaking profit and give you a clear, practical action plan to fix it."
      duration="1 Day"
      mode="Live Online or In-Person"
      audience="Business Owners Ready for Quick Clarity"
      topics={[
        "Business Health Diagnostic",
        "Inventory Quick-Wins",
        "Team Accountability Basics",
        "Cash Flow Snapshot",
        "Profit Leak Identification",
        "90-Day Action Plan",
      ]}
      ctaLabel="Register for the 1 Day Program"
      photoSrc="/rajesh-kumar-kare-1day.png"
      photoAlt="Rajesh Kumar Kare"
    />
  );
}
