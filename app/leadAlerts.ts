import { SHEET_TABS } from "./googleSheet";
import { formatInr } from "./plans";

// WhatsApp alerts to the team (Maytapi) and LeadGridd CRM contacts for new
// website entries. Sent from the server; they used to go from the Google Apps
// Script, which kept running out of its daily UrlFetch quota.
//
//   "Leads" tab            WhatsApp "New Website Lead"
//   "video form data" tab  WhatsApp "New Video Form Lead" + LeadGridd
//                          contact (LEADGRIDD_TOKEN_VIDEO)
//   "payment data" tab     WhatsApp "New Payment Received" + LeadGridd
//                          contact for ₹999 payments only (LEADGRIDD_TOKEN_PAYMENT)
//
// Every ID, token and number comes from environment variables (see
// .env.example), never from the code. Each message / contact is tried twice;
// if both fail it is only logged. Callers run these with after(), so a form
// or payment never waits for them or breaks because of them.

const MAYTAPI_API_URL = "https://api.maytapi.com/api";
const LEADGRIDD_CONTACTS_URL = "https://app.leadgridd.com/api/inbound/contacts";

// Gap between the alert to one number and the next.
const ALERT_GAP_MS = 2000;
// Wait before the one retry.
const RETRY_DELAY_MS = 2000;

// The only payment amount (₹) that becomes a LeadGridd contact.
const LEADGRIDD_PAYMENT_AMOUNT = 999;

type LeadGriddToken = "LEADGRIDD_TOKEN_VIDEO" | "LEADGRIDD_TOKEN_PAYMENT";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// On one line, so a form field can't add fake lines to an alert.
const text = (value: unknown, maxLength = 200) =>
  typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";

const env = (name: string) => process.env[name]?.trim() ?? "";

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

// 10-digit Indian mobile from what the visitor typed, or "".
function indianMobile(value: unknown) {
  const digits = text(value, 20).replace(/\D/g, "");
  const mobile =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

  return /^[6-9]\d{9}$/.test(mobile) ? mobile : "";
}

// Runs send, and once more after a short wait if it throws. Returns what went
// wrong the second time (and logs it), or "" when it worked.
async function tryTwice(label: string, send: () => Promise<void>) {
  try {
    await send();
    return "";
  } catch {
    await wait(RETRY_DELAY_MS);
  }

  try {
    await send();
    return "";
  } catch (error) {
    console.error(`${label} failed twice:`, error);
    return `${label}: ${errorText(error)}`;
  }
}

// Throws unless the service answered 2xx (and, for Maytapi, not success: false).
async function postJson(
  service: string,
  url: string,
  headers: Record<string, string>,
  body: unknown,
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const responseText = await response.text();
  let result: { success?: unknown } = {};

  try {
    result = JSON.parse(responseText);
  } catch {
    // Not JSON: the status decides.
  }

  if (!response.ok || result?.success === false) {
    throw new Error(
      `${service} answered ${response.status}: ${responseText.slice(0, 200)}`,
    );
  }
}

// ALERT_NUMBERS: comma separated, with country code (919876543210). A
// 10-digit number is taken as Indian and gets 91 in front.
function alertNumbers() {
  return env("ALERT_NUMBERS")
    .split(",")
    .map((number) => number.replace(/\D/g, ""))
    .filter(Boolean)
    .map((number) => (number.length === 10 ? `91${number}` : number));
}

// Sends message to every ALERT_NUMBERS number, one after the other. Returns
// what went wrong (also logged); empty when every number got it.
export async function sendWhatsAppAlert(message: string): Promise<string[]> {
  const productId = env("MAYTAPI_PRODUCT_ID");
  const phoneId = env("MAYTAPI_PHONE_ID");
  const token = env("MAYTAPI_TOKEN");
  const numbers = alertNumbers();

  if (!productId || !phoneId || !token || numbers.length === 0) {
    const problem =
      "WhatsApp alert not sent: MAYTAPI_PRODUCT_ID, MAYTAPI_PHONE_ID, MAYTAPI_TOKEN or ALERT_NUMBERS is not set.";

    console.error(problem);
    return [problem];
  }

  const url = `${MAYTAPI_API_URL}/${encodeURIComponent(productId)}/${encodeURIComponent(phoneId)}/sendMessage`;
  const problems: string[] = [];

  for (const [index, number] of numbers.entries()) {
    if (index > 0) {
      await wait(ALERT_GAP_MS);
    }

    const problem = await tryTwice(`WhatsApp alert to ${number}`, () =>
      postJson(
        "Maytapi",
        url,
        { "x-maytapi-key": token },
        { to_number: number, type: "text", message },
      ),
    );

    if (problem) {
      problems.push(problem);
    }
  }

  return problems;
}

// Adds one LeadGridd contact with the token in tokenName. Returns what went
// wrong (also logged); empty when it was added.
export async function sendToLeadGridd(
  tokenName: LeadGriddToken,
  contact: {
    fullName: unknown;
    email: unknown;
    phone: unknown;
    customAttributes?: Record<string, string>;
  },
): Promise<string[]> {
  const token = env(tokenName);
  const name = text(contact.fullName, 100);
  const email = text(contact.email, 150);
  const phone = indianMobile(contact.phone);

  const problem = !token
    ? `LeadGridd contact not sent: ${tokenName} is not set.`
    : !name || !email || !phone
      ? "LeadGridd contact not sent: name / email / mobile missing or invalid."
      : "";

  if (problem) {
    console.error(problem);
    return [problem];
  }

  const failure = await tryTwice(`LeadGridd contact (${tokenName})`, () =>
    postJson(
      "LeadGridd",
      LEADGRIDD_CONTACTS_URL,
      { Authorization: `Bearer ${token}` },
      {
        name,
        email,
        phoneNumber: `+91${phone}`,
        countryCode: "+91",
        contactType: "LEAD",
        ...(contact.customAttributes && {
          customAttributes: contact.customAttributes,
        }),
      },
    ),
  );

  return failure ? [failure] : [];
}

// Title, then one line per detail (empty ones left out), then the India time.
function alertMessage(title: string, entry: Record<string, unknown>) {
  const amount = Number(entry.amount);

  const lines = [
    ["Name", text(entry.fullName)],
    ["WhatsApp", text(entry.phone)],
    ["Email", text(entry.email)],
    ["Plan", text(entry.plan)],
    ["Amount", amount > 0 ? formatInr(amount) : ""],
    ["Work", text(entry.work)],
    ["Turnover", text(entry.turnover)],
    ["Source", text(entry.source)],
  ].filter(([, value]) => value);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date());

  return [
    title,
    "",
    ...lines.map(([label, value]) => `${label}: ${value}`),
    "",
    `Time: ${time} IST`,
  ].join("\n");
}

// A /api/leads entry, after it is sent to its tab (sheetName) of the Sheet.
export async function alertNewLead(
  sheetName: string,
  lead: Record<string, unknown>,
) {
  const isVideoForm = sheetName === SHEET_TABS.videoForm;

  const message = alertMessage(
    isVideoForm ? "🎥 *New Video Form Lead*" : "🔔 *New Website Lead*",
    {
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      plan: lead.planSelected,
      amount: lead.bookingAmount,
      work: lead.occupation,
      turnover: lead.annualTurnover || lead.revenue,
      source: lead.source,
    },
  );

  await Promise.all([
    sendWhatsAppAlert(message),
    isVideoForm &&
      sendToLeadGridd("LEADGRIDD_TOKEN_VIDEO", {
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        customAttributes: {
          annual_turnover: text(lead.revenue, 40),
          what_do_you_currently_do: text(lead.occupation, 40),
        },
      }),
  ]);
}

// A verified payment, with the "payment data" row's fields. amount is in
// rupees and comes from the Razorpay order, not the browser.
export async function alertNewPayment(payment: Record<string, unknown>) {
  const message = alertMessage("💰 *New Payment Received*", {
    fullName: payment.fullName,
    phone: payment.phone,
    email: payment.email,
    plan: payment.planSelected,
    amount: payment.amount,
    source: payment.source,
  });

  await Promise.all([
    sendWhatsAppAlert(message),
    payment.amount === LEADGRIDD_PAYMENT_AMOUNT &&
      sendToLeadGridd("LEADGRIDD_TOKEN_PAYMENT", {
        fullName: payment.fullName,
        email: payment.email,
        phone: payment.phone,
      }),
  ]);
}

// /api/alerts/test: one test WhatsApp alert to every ALERT_NUMBERS number and
// one test LeadGridd contact (with the video-form token, or the payment one).
export async function sendTestAlerts(leadGriddToken: LeadGriddToken) {
  const testLead = {
    fullName: "Website Alert Test",
    phone: "9999999999",
    email: "alert-test@example.com",
  };

  const [whatsApp, leadGridd] = await Promise.all([
    sendWhatsAppAlert(
      alertMessage("🧪 *Test Alert (website)*", {
        ...testLead,
        source: "/api/alerts/test",
      }),
    ),
    sendToLeadGridd(leadGriddToken, {
      ...testLead,
      ...(leadGriddToken === "LEADGRIDD_TOKEN_VIDEO" && {
        customAttributes: {
          annual_turnover: "₹3 Cr – ₹5 Cr",
          what_do_you_currently_do: "Other",
        },
      }),
    }),
  ]);

  return { whatsApp, leadGridd };
}
