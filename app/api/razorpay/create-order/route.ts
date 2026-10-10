import { NextResponse } from "next/server";
import { plans } from "@/app/plans";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

export async function POST(request: Request) {
  try {
    const { planId, amount, customer } = await request.json();

    // The plan decides the price, so a visitor can't pay one plan's price for another.
    const plan = plans.find((item) => item.id === planId);

    if (plan?.waitlist) {
      return NextResponse.json(
        {
          success: false,
          message: `${plan.label} is waitlist-only and can't be paid online. Please join the waitlist on WhatsApp.`,
        },
        {
          status: 400,
        },
      );
    }

    if (!plan || plan.amount == null) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't find the plan you selected. Please go back and choose your plan again.",
        },
        {
          status: 400,
        },
      );
    }

    // A mismatch means the price changed since the visitor started, or the amount was tampered with.
    if (amount !== plan.amount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The price for this plan has been updated. Please go back and start again to see the latest price.",
        },
        {
          status: 400,
        },
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured.");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayResponse = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: plan.amount * 100,
        currency: "INR",
        receipt: `rpians_${Date.now()}`,
        notes: {
          plan: plan.label,
          fullName: customer?.fullName ?? "",
          email: customer?.email ?? "",
          phone: customer?.phone ?? "",
          companyName: customer?.companyName ?? "",
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      throw new Error(
        order?.error?.description || "Failed to create Razorpay order.",
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not create payment order.",
      },
      {
        status: 500,
      },
    );
  }
}
