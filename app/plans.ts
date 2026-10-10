import { WHATSAPP_BASE_URL } from "./siteConfig";

export type Plan = {
  id: string;
  label: string;
  description: string;
  amount: number | null;
  gstApplicable?: boolean;
  // Waitlist-only plans have no online amount: they show this pricing and
  // send visitors to WhatsApp instead of checkout.
  waitlist?: {
    price: string;
    extra: string;
    shortPrice: string;
    until: string;
  };
};

export const plans: Plan[] = [
  {
    id: "day-1",
    label: "1 Day",
    description:
      "A focused one-day session to fix your biggest business bottleneck.",
    amount: 1199,
  },
  {
    id: "1-month",
    label: "1 Month",
    description:
      "Implement core business systems in one month with weekly reviews.",
    amount: 19999,
  },
  {
    id: "10-month",
    label: "10 Month",
    description:
      "A complete business transformation mentorship journey.",
    // Includes GST: this is the exact amount charged (no gstApplicable).
    amount: 590000,
  },
  {
    id: "personal-mentorship",
    label: "Personal Mentorship",
    description:
      "One-on-one mentorship with direct access to Rajesh Kumar Kare.",
    // Not payable online (too large for Razorpay); waitlist via WhatsApp.
    amount: null,
    waitlist: {
      price: "₹1.5 Crore / Year",
      extra: "+ Profit Sharing",
      shortPrice: "₹1.5 Cr / Year + Profit Sharing",
      until: "2030",
    },
  },
  {
    id: "strategy-call",
    label: "Book a Strategy Call",
    description:
      "A one-on-one strategy call with the RPIANS team to understand your business and recommend the right program.",
    amount: 999,
  },
];

// ₹1 crore and above reads as "₹1.50 Cr"; smaller amounts use Indian grouping.
export function formatInr(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPlanAmount(plan: Plan): string {
  if (plan.waitlist) {
    return `${plan.waitlist.shortPrice} · Waitlist till ${plan.waitlist.until}`;
  }

  if (plan.amount == null) {
    return "Custom";
  }

  const formatted = formatInr(plan.amount);

  return plan.gstApplicable ? `${formatted} + GST` : formatted;
}

// The heading next to a plan's price ("1 Day — Booking Amount").
export function planAmountLabel(plan: Plan): string {
  return plan.waitlist ? "Investment" : "Booking Amount";
}

// WhatsApp chat for joining a waitlist-only plan.
export function waitlistWhatsAppUrl(plan: Plan): string {
  const price = plan.waitlist
    ? ` (${plan.waitlist.price} ${plan.waitlist.extra})`
    : "";

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    `Hi RPIANS Team, I want more info about ${plan.label}${price} and the waitlist.`,
  )}`;
}
