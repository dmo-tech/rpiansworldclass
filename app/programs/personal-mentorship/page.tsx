import type { Metadata } from "next";

import ProgramOffer from "../../ProgramOffer";
import ProgramPageTemplate from "../../ProgramPageTemplate";
import { plans } from "../../plans";

export const metadata: Metadata = {
  title: "Personal Mentorship",
  description:
    "One-on-one personal mentorship with direct access to Rajesh Kumar Kare for serious business owners.",
};

// Waitlist-only: pricing comes from plans.ts. Both "Explore Exclusive
// Mentorship" buttons open /register's questions, then the call step, which
// ends with "Join the Waitlist" on WhatsApp.
const PLAN = plans.find((plan) => plan.id === "personal-mentorship")!;
const WAITLIST = PLAN.waitlist!;
const REGISTER_URL = `/register?plan=${PLAN.id}`;

const HIGHLIGHTS = [
  "Customized One-on-One Mentorship to accelerate business growth, automation, and profit multiplication.",
  "Complete Implementation Hand-Holding for Inventory, HRMS, Cash Flow, Profit Multiplication, and Business Automation Systems.",
];

export default function PersonalMentorshipProgramPage() {
  return (
    <ProgramPageTemplate
      eyebrow="1:1 Personal Mentorship With Rajesh Kumar Kare"
      headingLine1="Personal Mentorship For"
      headingLine2="Serious Business Owners"
      heroContent={
        <ProgramOffer
          centered
          compact
          label="Personal Mentorship"
          highlights={HIGHLIGHTS}
          price={
            <>
              {/* Slightly smaller below 360px so the one-line price fits. */}
              <span className="whitespace-nowrap max-[360px]:text-[2rem]">
                {WAITLIST.price}
              </span>{" "}
              <span className="whitespace-nowrap max-[360px]:text-[2rem]">
                {WAITLIST.extra}
              </span>
            </>
          }
          badge={`⏳ Waitlist Till ${WAITLIST.until}`}
          moreInfoUrl={REGISTER_URL}
          moreInfoLabel="Explore Exclusive Mentorship"
        />
      }
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
      ctaLabel="Explore Exclusive Mentorship"
      planId="personal-mentorship"
      // The whole offer (up to the Explore button) fits one laptop screen.
      compactHero
    />
  );
}
