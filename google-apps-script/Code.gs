/**
 * RPIANS Website Leads - Google Apps Script web app.
 *
 * The website (worldclassbc.com) sends every form and every video update here
 * as JSON. Each one is written to its own tab of this spreadsheet:
 *
 *   "Leads"                           /register and any other lead form
 *   "video form data"                 the "Get Started" form on the video
 *   "calender book data & form data"  the Book a Call page (/book-call)
 *   "video watch data"                video watch tracking (one row per viewing session)
 *
 * A tab that doesn't exist yet is created automatically, with a bold header row.
 *
 * To update: paste this whole file over the old code, Save, then
 * Deploy -> Manage deployments -> Edit (pencil) -> Version: New version -> Deploy.
 * That keeps the SAME web app URL. See README.md for the full steps.
 */

// Leave empty when this script was opened from the sheet (Extensions -> Apps Script).
// Only needed for a standalone script: put the spreadsheet ID from its URL here.
const SPREADSHEET_ID = "";

const TIMEZONE = "Asia/Kolkata";
const DATE_FORMAT = "dd/MM/yyyy HH:mm:ss";
const DEFAULT_STATUS = "New";

const TABS = {
  LEADS: "Leads",
  VIDEO_FORM: "video form data",
  CALL_BOOKING: "calender book data & form data",
  VIDEO_WATCH: "video watch data",
};

// Column order for each tab: [header, value].
// A value is the name of the field sent by the website (or a list of names:
// the first one that has a value is used), or a function (data, now) => value.
const COLUMNS = {
  // The first 11 columns are the existing Leads columns, in their current
  // order. Newer columns are added at the END so old rows never shift.
  [TABS.LEADS]: [
    ["Date", (data, now) => now],
    ["Full Name", "fullName"],
    ["WhatsApp Number", "phone"],
    ["Email", "email"],
    ["Company Name", "companyName"],
    ["Business Category", "businessCategory"],
    ["Annual Turnover", "annualTurnover"],
    ["Number of Employees", "employeeCount"],
    ["Biggest Challenge", ["biggestChallenge", "challenge", "message"]],
    ["Lead Source", ["source", "formType"]],
    ["Lead Status", () => DEFAULT_STATUS],
    ["Selected Plan", "planSelected"],
    ["Amount", "bookingAmount"],
    ["Call Date", "bookingDate"],
    ["Call Time", "bookingTime"],
  ],

  [TABS.CALL_BOOKING]: [
    ["Date", (data, now) => now],
    ["Full Name", "fullName"],
    ["WhatsApp Number", "phone"],
    ["Email", "email"],
    ["Company Name", "companyName"],
    ["Call Date", "bookingDate"],
    ["Call Time", "bookingTime"],
    ["Message", "message"],
    ["Lead Source", ["source", "formType"]],
    ["Status", () => DEFAULT_STATUS],
  ],

  // The video form also asks two questions; they are kept at the end.
  [TABS.VIDEO_FORM]: [
    ["Date", (data, now) => now],
    ["Full Name", "fullName"],
    ["WhatsApp Number", "phone"],
    ["Email", "email"],
    ["Company Name", "companyName"],
    ["Lead Source", ["source", "formType"]],
    ["Status", () => DEFAULT_STATUS],
    ["What do you currently do?", "occupation"],
    ["Annual Turnover", "revenue"],
  ],

  // One row per viewing session, updated as the visitor keeps watching.
  // "Date" is when the session started; "Last Updated" is the latest update.
  [TABS.VIDEO_WATCH]: [
    ["Date", (data, now) => now],
    ["Session ID", "sessionId"],
    ["Name", "fullName"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Seconds Watched", (data) => toNumber(data.minutesWatched) === "" ? "" : Math.round(toNumber(data.minutesWatched) * 60)],
    ["Percent Watched", "maxPercent"],
    ["Completed", "completed"],
    ["Source", "pageUrl"],
    ["Last Event", "event"],
    ["Device", "device"],
    ["Browser", "browser"],
    ["What do you currently do?", "occupation"],
    ["Annual Turnover", "revenue"],
    ["Last Updated", (data, now) => now],
  ],
};

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    // Wait (up to 30 s) so two submissions at the same moment can't overwrite each other.
    lock.waitLock(30000);
  } catch (error) {
    return jsonResponse({ success: false, message: "The sheet is busy, please try again." });
  }

  try {
    const data = parseBody(e);
    const sheetName = resolveSheetName(data);
    const columns = COLUMNS[sheetName];
    const sheet = getOrCreateSheet(sheetName);

    ensureHeader(sheet, columns.map((column) => column[0]));

    const now = "'" + Utilities.formatDate(new Date(), TIMEZONE, DATE_FORMAT);
    const row = columns.map((column) => cellValue(column[1], data, now));

    if (sheetName === TABS.VIDEO_WATCH) {
      saveVideoWatchRow(sheet, row, data);
    } else {
      sheet.appendRow(row);
    }

    return jsonResponse({ success: true, sheetName: sheetName });
  } catch (error) {
    return jsonResponse({ success: false, message: String((error && error.message) || error) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser just confirms it is running.
function doGet() {
  return jsonResponse({ success: true, message: "RPIANS website leads endpoint is running." });
}

function parseBody(e) {
  const contents = e && e.postData && e.postData.contents;

  if (!contents) {
    throw new Error("Empty request body.");
  }

  const data = JSON.parse(contents);

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid request body.");
  }

  return data;
}

// The tab named in sheetName. Older website versions don't send sheetName,
// so their form type decides; anything else goes to "Leads".
function resolveSheetName(data) {
  const knownTabs = Object.keys(TABS).map((key) => TABS[key]);

  if (knownTabs.indexOf(data.sheetName) !== -1) {
    return data.sheetName;
  }

  switch (data.formType) {
    case "Call Booking":
      return TABS.CALL_BOOKING;
    case "Video Form":
      return TABS.VIDEO_FORM;
    case "Video View":
      return TABS.VIDEO_WATCH;
    default:
      return TABS.LEADS;
  }
}

function getOrCreateSheet(name) {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("No spreadsheet found. Open this script from the sheet (Extensions -> Apps Script) or set SPREADSHEET_ID.");
  }

  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

// Empty tab: write the bold header row. Existing tab: only fill in header
// cells that are still blank (new columns at the end); never rename a column.
function ensureHeader(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return;
  }

  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];

  headers.forEach((header, index) => {
    if (current[index] === "" || current[index] === null) {
      sheet.getRange(1, index + 1).setValue(header).setFontWeight("bold");
    }
  });
}

// Video watch tracking keeps ONE row per session: update it if it exists
// (keeping its first Date), otherwise add it.
function saveVideoWatchRow(sheet, row, data) {
  const sessionId = String(data.sessionId || "");
  const lastRow = sheet.getLastRow();

  if (sessionId && lastRow >= 2) {
    const ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues();

    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === sessionId) {
        sheet.getRange(i + 2, 2, 1, row.length - 1).setValues([row.slice(1)]);
        return;
      }
    }
  }

  sheet.appendRow(row);
}

function cellValue(source, data, now) {
  let value;

  if (typeof source === "function") {
    value = source(data, now);
  } else {
    const fields = Array.isArray(source) ? source : [source];

    value = "";
    for (let i = 0; i < fields.length; i++) {
      const candidate = data[fields[i]];

      if (candidate !== undefined && candidate !== null && candidate !== "") {
        value = candidate;
        break;
      }
    }
  }

  return safeCell(value);
}

// Text that starts with = + - @ would be read by Sheets as a formula (e.g. a
// phone number like "+91 ..."). A leading ' keeps it as plain text.
function safeCell(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "number" || typeof value === "boolean") return value;

  const text = String(value);

  if (text.charAt(0) === "'") return text;
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function toNumber(value) {
  const number = Number(value);
  return value === "" || value === null || value === undefined || !isFinite(number) ? "" : number;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
