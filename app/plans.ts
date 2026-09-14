export type Plan = {
  id: string;
  label: string;
  description: string;
  amount: number | null;
};

export const plans: Plan[] = [
  {
    id: "day-1",
    label: "Day 1",
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
];
