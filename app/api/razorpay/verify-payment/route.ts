import { after, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

import { saveToGoogleSheet, SHEET_TABS } from "@/app/googleSheet";
import { alertNewPayment } from "@/app/leadAlerts";
import {
  fetchRazorpayOrder,
  orderNote,
  type RazorpayOrder,
} from "@/app/razorpay";

// Adds a verified payment to the "payment data" tab and sends its WhatsApp
// alert / LeadGridd contact (app/leadAlerts.ts). Name, phone, email,
// plan and source come from the Razorpay order's notes (written by
// create-order) and the amount from the order itself, so the row shows what
// was really paid, not what the browser says. No call time is picked on the
// site any more, so the sheet's Call Date / Call Time stay empty. If the
// order can't be loaded, the row still has the payment and order IDs.
// Never throws: the visitor already has their success screen.
async function recordPayment(orderId: string, paymentId: string) {
  let order: RazorpayOrder | null = null;

  try {
    order = await fetchRazorpayOrder(orderId);

    if (!order) {
      throw new Error("Razorpay has no such order.");
    }
  } catch (error) {
    console.error(
      `Payment sheet: Razorpay order ${orderId} could not be loaded (payment ${paymentId}):`,
      error,
    );
  }

  const note = (key: string) => orderNote(order, key);

  const payment = {
    fullName: note("fullName"),
    phone: note("phone"),
    email: note("email"),
    planSelected: note("plan"),
    // Razorpay amounts are in paise.
    amount: typeof order?.amount === "number" ? order.amount / 100 : "",
    paymentId,
    orderId,
    source: note("source"),
  };

  // The WhatsApp alert (and, for ₹999, the LeadGridd contact) goes out
  // whether or not the Sheet saves.
  await Promise.all([
    saveToGoogleSheet({
      sheetName: SHEET_TABS.payment,
      formType: "Payment",
      ...payment,
    }).catch((error) => {
      console.error(
        `Payment sheet error (payment ${paymentId}, order ${orderId}):`,
        error,
      );
    }),
    alertNewPayment(payment),
  ]);
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
