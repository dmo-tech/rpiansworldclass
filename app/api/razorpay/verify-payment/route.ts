import { after, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

import { saveToGoogleSheet, SHEET_TABS } from "@/app/googleSheet";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

type RazorpayOrder = {
  amount?: number;
  // Razorpay sends [] when an order has no notes.
  notes?: Record<string, unknown> | unknown[];
};

async function fetchRazorpayOrder(orderId: string): Promise<RazorpayOrder> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const razorpayResponse = await fetch(
    `${RAZORPAY_ORDERS_URL}/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );

  const order = await razorpayResponse.json();

  if (!razorpayResponse.ok) {
    throw new Error(
      order?.error?.description ||
        `Razorpay order request failed: ${razorpayResponse.status}`,
    );
  }

  return order;
}

// Adds a verified payment to the "payment data" tab. Name, phone, email,
// plan, call date / time and source come from the Razorpay order's notes
// (written by create-order) and the amount from the order itself, so the row
// shows what was really paid, not what the browser says. If the order can't
// be loaded, the row still has the payment and order IDs.
// Never throws: the visitor already has their success screen.
async function recordPayment(orderId: string, paymentId: string) {
  let order: RazorpayOrder | null = null;

  try {
    order = await fetchRazorpayOrder(orderId);
  } catch (error) {
    console.error(
      `Payment sheet: Razorpay order ${orderId} could not be loaded (payment ${paymentId}):`,
      error,
    );
  }

  const notes =
    order?.notes && !Array.isArray(order.notes) ? order.notes : {};
  const note = (key: string) =>
    typeof notes[key] === "string" ? notes[key] : "";

  try {
    await saveToGoogleSheet({
      sheetName: SHEET_TABS.payment,
      formType: "Payment",
      fullName: note("fullName"),
      phone: note("phone"),
      email: note("email"),
      planSelected: note("plan"),
      // Razorpay amounts are in paise.
      amount: typeof order?.amount === "number" ? order.amount / 100 : "",
      paymentId,
      orderId,
      bookingDate: note("bookingDate"),
      bookingTime: note("bookingTime"),
      source: note("source"),
    });
  } catch (error) {
    console.error(
      `Payment sheet error (payment ${paymentId}, order ${orderId}):`,
      error,
    );
  }
}

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing payment verification details.",
        },
        {
          status: 400,
        },
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("Razorpay credentials are not configured.");
    }

    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment signature verification failed.",
        },
        {
          status: 400,
        },
      );
    }

    // Runs after the response is sent, so a slow or failing Google Sheet
    // never delays or breaks the visitor's payment success.
    after(() =>
      recordPayment(String(razorpay_order_id), String(razorpay_payment_id)),
    );

    // TODO: Trigger WhatsApp booking confirmation message here once that integration is ready.

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("Razorpay verify-payment error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment verification failed.",
      },
      {
        status: 500,
      },
    );
  }
}
