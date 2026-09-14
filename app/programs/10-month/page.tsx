import type { Metadata } from "next";

import ProgramPageTemplate from "../../ProgramPageTemplate";

export const metadata: Metadata = {
  title: "10 Month Program",
  description:
    "A 10-month business transformation mentorship program covering full-scale automation, leadership and profit multiplication.",
};

export default function TenMonthProgramPage() {
  return (
    <ProgramPageTemplate
      eyebrow="10 Month Business Transformation Mastery"
      headingLine1="10 Month Business Automation"
      headingLine2="Mastery Program"
      description="A complete 10-month mentorship journey that takes your business from daily firefighting to full automation, strong leadership and consistent profit growth."
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
    />
  );
}
