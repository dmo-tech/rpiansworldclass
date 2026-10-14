// Server-side reads from the Razorpay API (route handlers only: they use the
// key secret). create-order still creates orders itself.

const RAZORPAY_API_URL = "https://api.razorpay.com/v1";

export type RazorpayOrder = {
  amount?: number;
  // Razorpay sends [] when an order has no notes.
  notes?: Record<string, unknown> | unknown[];
};

export type RazorpayPayment = {
  status?: string;
  order_id?: string;
};

// Throws if Razorpay can't be reached or answers with an error; null when it
// says the id doesn't exist (400 / 404).
async function getFromRazorpay<T>(path: string): Promise<T | null> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const razorpayResponse = await fetch(`${RAZORPAY_API_URL}${path}`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const result = await razorpayResponse.json();

  if (razorpayResponse.status === 400 || razorpayResponse.status === 404) {
    return null;
  }

  if (!razorpayResponse.ok) {
    throw new Error(
      result?.error?.description ||
        `Razorpay request failed: ${razorpayResponse.status}`,
    );
  }

  return result as T;
}

export const fetchRazorpayOrder = (orderId: string) =>
  getFromRazorpay<RazorpayOrder>(`/orders/${encodeURIComponent(orderId)}`);

export const fetchRazorpayPayment = (paymentId: string) =>
  getFromRazorpay<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`);

// Authorized payments are captured automatically a moment later.
export const isPaymentPaid = (payment: RazorpayPayment | null) =>
  payment?.status === "captured" || payment?.status === "authorized";

// A string note from the order (create-order writes them), or "".
export function orderNote(order: RazorpayOrder | null, key: string): string {
  const notes =
    order?.notes && !Array.isArray(order.notes) ? order.notes : {};

  return typeof notes[key] === "string" ? notes[key] : "";
}
