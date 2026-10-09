export type Plan = {
  id: string;
  label: string;
  description: string;
  amount: number | null;
  gstApplicable?: boolean;
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
    amount: 9999,
  },
  {
    id: "10-month",
    label: "10 Month",
    description:
      "A complete business transformation mentorship journey.",
    amount: null,
  },
  {
    id: "personal-mentorship",
    label: "Personal Mentorship",
    description:
      "One-on-one mentorship with direct access to Rajesh Kumar Kare.",
    amount: 15000000,
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
  if (plan.amount == null) {
    return "Custom";
  }

  const formatted = formatInr(plan.amount);

  return plan.gstApplicable ? `${formatted} + GST` : formatted;
}
