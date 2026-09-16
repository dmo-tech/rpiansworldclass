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
    amount: 999,
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
    amount: 5000000,
    gstApplicable: true,
  },
];

export function formatPlanAmount(plan: Plan): string {
  if (plan.amount == null) {
    return "Custom";
  }

  const formatted = `₹${plan.amount.toLocaleString("en-IN")}`;

  return plan.gstApplicable ? `${formatted} + GST` : formatted;
}
