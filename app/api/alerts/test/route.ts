import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

import { sendTestAlerts } from "@/app/leadAlerts";

// Checks the WhatsApp alert and LeadGridd setup: open
//   /api/alerts/test?secret=<ALERT_TEST_SECRET>
// to send one test WhatsApp alert to every ALERT_NUMBERS number and add one
// test LeadGridd contact with LEADGRIDD_TOKEN_VIDEO (add &leadgridd=payment
// to use LEADGRIDD_TOKEN_PAYMENT instead). The answer lists anything that
// failed. Without ALERT_TEST_SECRET the route is switched off (404).

// Hashed first so the comparison takes the same time whatever was sent.
const sameSecret = (given: string, expected: string) => {
  const hash = (value: string) => createHash("sha256").update(value).digest();

  return timingSafeEqual(hash(given), hash(expected));
};

export async function GET(request: Request) {
  const expected = process.env.ALERT_TEST_SECRET?.trim() ?? "";
  const params = new URL(request.url).searchParams;

  if (!expected) {
    return NextResponse.json(
      { success: false, message: "Not found." },
      { status: 404 },
    );
  }

  if (!sameSecret(params.get("secret") ?? "", expected)) {
    return NextResponse.json(
      { success: false, message: "Wrong or missing secret." },
      { status: 401 },
    );
  }

  const leadGriddToken =
    params.get("leadgridd") === "payment"
      ? "LEADGRIDD_TOKEN_PAYMENT"
      : "LEADGRIDD_TOKEN_VIDEO";

  const { whatsApp, leadGridd } = await sendTestAlerts(leadGriddToken);

  return NextResponse.json({
    success: whatsApp.length === 0 && leadGridd.length === 0,
    whatsApp: whatsApp.length === 0 ? "Sent to every ALERT_NUMBERS number." : whatsApp,
    leadGridd:
      leadGridd.length === 0 ? `Test contact added (${leadGriddToken}).` : leadGridd,
  });
}
