import type { Metadata } from "next";

import ProgramPageTemplate from "../../ProgramPageTemplate";

export const metadata: Metadata = {
  title: "Personal Mentorship",
  description:
    "One-on-one personal mentorship with direct access to Rajesh Kumar Kare for serious business owners.",
};

export default function PersonalMentorshipProgramPage() {
  return (
    <ProgramPageTemplate
      eyebrow="1:1 Personal Mentorship With Rajesh Kumar Kare"
      headingLine1="Personal Mentorship For"
      headingLine2="Serious Business Owners"
      description="A fully personalised, one-on-one mentorship journey with direct access to Rajesh Kumar Kare — built to take your business to a completely system-driven, automated and highly profitable state."
      duration="Ongoing 1:1 Mentorship"
      mode="Private 1:1 Sessions"
      audience="Established Business Owners Ready for Elite Guidance"
      topics={[
        "Direct 1:1 Access to Rajesh Kumar Kare",
        "Fully Customised Business Roadmap",
        "Priority Implementation Support",
        "Advanced Automation & AI Systems",
        "Leadership and Team Development",
        "Dedicated Profit Multiplication Strategy",
      ]}
      ctaLabel="Apply for Personal Mentorship"
      planId="personal-mentorship"
    />
  );
}
