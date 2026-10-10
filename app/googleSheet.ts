// Google Apps Script web app that writes website data into the RPIANS
// Google Sheet. Used by /api/leads and /api/video-views. If the Apps Script
// is ever deployed under a new URL, change it here only.
export const GOOGLE_SHEET_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycby7gNgcO-id8ERU2igs7R8_oqRVr0gm9ZO8uvndLD3GEmvRywjH9yXvesrs1LwKjBY/exec";

// Tabs in the "RPIANS Website Leads" sheet (exact names; the Apps Script in
// google-apps-script/Code.gs uses the same ones).
export const SHEET_TABS = {
  leads: "Leads",
  videoForm: "video form data",
  callBooking: "calender book data & form data",
  videoWatch: "video watch data",
} as const;

// Which tab a /api/leads submission goes to. Decided here on the server from
// the form type; a sheetName sent by the browser is never used.
export function sheetNameForLead(formType: unknown): string {
  if (formType === "Call Booking") return SHEET_TABS.callBooking;
  if (formType === "Video Form") return SHEET_TABS.videoForm;

  return SHEET_TABS.leads;
}
