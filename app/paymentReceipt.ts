// Handed from /payment to /thank-you through sessionStorage after the server
// has verified a Razorpay payment. Only display-safe fields belong here —
// never the signature, order secrets or API keys.
export const PAYMENT_RECEIPT_STORAGE_KEY = "rpiansPaymentReceipt";

export type PaymentReceipt = {
  planName: string;
  amount: number;
  paymentId: string;
};

const RAZORPAY_PAYMENT_ID_PATTERN = /^pay_[A-Za-z0-9]{1,40}$/;

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
      };
    }
  } catch {
    // Fall through to the generic thank-you message.
  }

  return null;
}
