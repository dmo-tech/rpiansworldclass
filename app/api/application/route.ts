import { after, NextResponse } from "next/server";

import {
  APPLICATION_QUESTIONS,
  CONTACT_QUESTIONS,
  questionName,
  validateAnswer,
} from "@/app/businessQuestions";
import { saveToGoogleSheet, SHEET_TABS } from "@/app/googleSheet";
import { RAZORPAY_PAYMENT_ID_PATTERN } from "@/app/paymentReceipt";
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  isPaymentPaid,
  orderNote,
  type RazorpayPayment,
} from "@/app/razorpay";

// The application form after payment (/application?payment=pay_…).
// GET tells the page whether that payment is real and paid, so the form only
// opens after a payment (also from a link opened later, e.g. on WhatsApp).
// POST saves the answers to the "application form data" tab.

export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get("payment") ?? "";

  if (!RAZORPAY_PAYMENT_ID_PATTERN.test(paymentId)) {
    return NextResponse.json({ success: true, paid: false });
  }

  try {
    const payment = await fetchRazorpayPayment(paymentId);

    return NextResponse.json({ success: true, paid: isPaymentPaid(payment) });
  } catch (error) {
    console.error(`Application: payment ${paymentId} could not be checked:`, error);

    return NextResponse.json(
      { success: false, message: "The payment could not be checked." },
      { status: 503 },
    );
  }
}

// Order ID and plan come from Razorpay, not the browser. If Razorpay can't be
// reached the answers are still saved (without them); a payment Razorpay says
// isn't paid is not saved. Never throws: it runs after the response.
async function saveApplication(
  paymentId: string,
  contact: Record<string, string>,
  answers: Record<string, string>,
) {
  let payment: RazorpayPayment | null = null;
  let planSelected = "";

  try {
    payment = await fetchRazorpayPayment(paymentId);

    if (!isPaymentPaid(payment)) {
      console.error(
        `Application not saved: payment ${paymentId} is not paid (${payment?.status ?? "not found"}).`,
      );
      return;
    }

    if (payment?.order_id) {
      planSelected = orderNote(await fetchRazorpayOrder(payment.order_id), "plan");
    }
  } catch (error) {
    console.error(
      `Application sheet: Razorpay details for payment ${paymentId} could not be loaded:`,
      error,
    );
  }

  try {
    await saveToGoogleSheet({
      sheetName: SHEET_TABS.application,
      formType: "Application Form",
      ...contact,
      paymentId,
      orderId: payment?.order_id ?? "",
      planSelected,
      ...answers,
    });
  } catch (error) {
    console.error(`Application sheet error (payment ${paymentId}):`, error);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const paymentId = typeof body?.paymentId === "string" ? body.paymentId : "";

  if (!RAZORPAY_PAYMENT_ID_PATTERN.test(paymentId)) {
    return NextResponse.json(
      { success: false, message: "Invalid payment." },
      { status: 400 },
    );
  }

  const rawAnswers =
    body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
      ? (body.answers as Record<string, unknown>)
      : {};

  const read = (source: Record<string, unknown>, id: string) =>
    typeof source[id] === "string" ? source[id].trim() : "";

  // Contact fields keep their field names; answers are keyed by question name,
  // which becomes the column heading in the sheet.
  const contact: Record<string, string> = {};
  const answers: Record<string, string> = {};

  for (const question of CONTACT_QUESTIONS) {
    contact[question.id] = read(body, question.id);
  }

  for (const question of APPLICATION_QUESTIONS) {
    answers[questionName(question)] = read(rawAnswers, question.id);
  }

  const error =
    CONTACT_QUESTIONS.map((question) =>
      validateAnswer(question, contact[question.id]),
    ).find(Boolean) ||
    APPLICATION_QUESTIONS.map((question) =>
      validateAnswer(question, answers[questionName(question)]),
    ).find(Boolean);

  if (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }

  // After the response, so a slow Google Sheet never keeps the visitor waiting.
  after(() => saveApplication(paymentId, contact, answers));

  return NextResponse.json({ success: true });
}
