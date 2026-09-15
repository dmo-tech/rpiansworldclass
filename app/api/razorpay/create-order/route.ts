import { NextResponse } from "next/server";
import { plans } from "@/app/plans";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

const ALLOWED_AMOUNTS_INR = plans
  .map((plan) => plan.amount)
  .filter((amount): amount is number => amount != null);

export async function POST(request: Request) {
  try {
    const { amount, customer } = await request.json();

    if (typeof amount !== "number" || !ALLOWED_AMOUNTS_INR.includes(amount)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
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
        amount: amount * 100,
        currency: "INR",
        receipt: `rpians_${Date.now()}`,
        notes: {
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
