// Handed from /payment (via /application) to /thank-you through
// sessionStorage after the server has verified a Razorpay payment. Only display-safe fields belong here —
// never the signature, order secrets or API keys.
export const PAYMENT_RECEIPT_STORAGE_KEY = "rpiansPaymentReceipt";

export type PaymentReceipt = {
  planName: string;
  amount: number;
  paymentId: string;
  // The booked call, e.g. "Monday, 20 October 2026" and "11:00 AM IST".
  callDate?: string;
  callTime?: string;
};

const optionalText = (value: unknown) =>
  typeof value === "string" && value.length <= 100 ? value : undefined;

export const RAZORPAY_PAYMENT_ID_PATTERN = /^pay_[A-Za-z0-9]{1,40}$/;

export function parsePaymentReceipt(raw: string | null): PaymentReceipt | null {
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);

    if (
      typeof data?.planName === "string" &&
      data.planName.length <= 100 &&
      typeof data?.amount === "number" &&
      Number.isFinite(data.amount) &&
      data.amount > 0 &&
      typeof data?.paymentId === "string" &&
      RAZORPAY_PAYMENT_ID_PATTERN.test(data.paymentId)
    ) {
      return {
        planName: data.planName,
        amount: data.amount,
        paymentId: data.paymentId,
        callDate: optionalText(data.callDate),
        callTime: optionalText(data.callTime),
      };
    }
  } catch {
    // Fall through to the generic thank-you message.
  }

  return null;
}

// The call picked in the application form (Book a Call under the /watch
// video pays before the call is booked), so /thank-you shows it.
export function addCallToPaymentReceipt(
  paymentId: string,
  callDate: string,
  callTime: string,
) {
  try {
    const receipt = parsePaymentReceipt(
      sessionStorage.getItem(PAYMENT_RECEIPT_STORAGE_KEY),
    );

    if (receipt?.paymentId === paymentId) {
      sessionStorage.setItem(
        PAYMENT_RECEIPT_STORAGE_KEY,
        JSON.stringify({ ...receipt, callDate, callTime }),
      );
    }
  } catch {
    // Storage blocked: /thank-you shows its generic message anyway.
  }
}

// The application form that follows a payment. The link also works later,
// e.g. from WhatsApp: /application checks the payment with Razorpay.
export const applicationPath = (paymentId: string) =>
  `/application?payment=${encodeURIComponent(paymentId)}`;

// Remembered on this browser once the application is saved, so /thank-you
// only asks to complete it when it's still open.
const applicationSubmittedKey = (paymentId: string) =>
  `rpiansApplicationSubmitted:${paymentId}`;

export function markApplicationSubmitted(paymentId: string) {
  try {
    localStorage.setItem(applicationSubmittedKey(paymentId), "1");
  } catch {
    // Storage blocked: /thank-you still offers the form, which is harmless.
  }
}

export function isApplicationSubmitted(paymentId: string) {
  try {
    return localStorage.getItem(applicationSubmittedKey(paymentId)) === "1";
  } catch {
    return false;
  }
}
