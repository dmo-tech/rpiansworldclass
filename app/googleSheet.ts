// Google Apps Script web app that writes website data into the RPIANS
// Google Sheet. Used by /api/leads, /api/video-views, /api/application and
// /api/razorpay/verify-payment. If the Apps Script is ever deployed under a
// new URL, change it here only.
export const GOOGLE_SHEET_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycby7gNgcO-id8ERU2igs7R8_oqRVr0gm9ZO8uvndLD3GEmvRywjH9yXvesrs1LwKjBY/exec";

// Tabs in the "RPIANS Website Leads" sheet (exact names; the Apps Script in
// google-apps-script/Code.gs uses the same ones). "calender book data & form
// data" is no longer written: the Book a Call calendar page was removed.
export const SHEET_TABS = {
  leads: "Leads",
  videoForm: "video form data",
  videoWatch: "video watch data",
  payment: "payment data",
  application: "application form data",
} as const;

// Which tab a /api/leads submission goes to. Decided here on the server from
// the form type; a sheetName sent by the browser is never used.
export function sheetNameForLead(formType: unknown): string {
  if (formType === "Video Form") return SHEET_TABS.videoForm;

  return SHEET_TABS.leads;
}

// Sends one row to the Apps Script (sheetName picks the tab) and throws if it
// wasn't saved; each caller decides what a failure means.
export async function saveToGoogleSheet(data: Record<string, unknown>) {
  const googleResponse = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const responseText = await googleResponse.text();

  let googleResult: {
    success?: boolean;
    message?: string;
  };

  try {
    googleResult = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Google Apps Script returned an invalid response: ${responseText.slice(
        0,
        200,
      )}`,
    );
  }

  if (!googleResponse.ok || !googleResult.success) {
    throw new Error(
      googleResult.message ||
        `Google Apps Script request failed: ${googleResponse.status}`,
    );
  }
}
