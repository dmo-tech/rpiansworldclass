import { plans } from "./plans";

// A booked call is paid for as the "Book a Strategy Call" plan (₹999).
const STRATEGY_CALL_PLAN = plans.find((plan) => plan.id === "strategy-call");

// Saves a strategy-call booking for /payment, which reads it from
// sessionStorage and shows the name, WhatsApp and email. Payment is step 2 of
// 2 (after the details form); the team schedules the call after it. False if
// storage is blocked.
export function saveStrategyCallBooking(
  contact: { fullName: string; phone: string; email: string },
  source: string,
): boolean {
  if (!STRATEGY_CALL_PLAN) {
    return false;
  }

  try {
    sessionStorage.setItem(
      "rpiansApplicationData",
      JSON.stringify({
        fullName: contact.fullName,
        phone: contact.phone,
        email: contact.email,
        companyName: "",
        planId: STRATEGY_CALL_PLAN.id,
        planSelected: STRATEGY_CALL_PLAN.label,
        bookingAmount: STRATEGY_CALL_PLAN.amount,
        gstApplicable: STRATEGY_CALL_PLAN.gstApplicable ?? false,
        stepCount: 2,
        submittedAt: new Date().toISOString(),
        source,
      }),
    );

    return true;
  } catch {
    return false;
  }
}
