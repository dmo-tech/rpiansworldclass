import { NextResponse } from "next/server";
import { GOOGLE_SHEET_WEB_APP_URL } from "../../googleSheet";

// Receives watch-progress updates from GatedVideoPlayer and forwards them to
// the Apps Script, which keeps ONE row per sessionId in the "Video Views"
// tab. The body is read as text because navigator.sendBeacon (used when the
// page closes) sends text/plain, not application/json.

const text = (value: unknown, maxLength = 200) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const clampNumber = (value: unknown, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : min;
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const sessionId = text(body.sessionId, 64);

  if (!/^[A-Za-z0-9-]{8,64}$/.test(sessionId)) {
    return NextResponse.json(
      { success: false, message: "Invalid session." },
      { status: 400 },
    );
  }

  const viewData = {
    formType: "Video View",
    sessionId,
    event: text(body.event, 20),
    fullName: text(body.fullName, 100),
    phone: text(body.phone, 15),
    email: text(body.email, 150),
    occupation: text(body.occupation, 40),
    revenue: text(body.revenue, 40),
    maxPercent: Math.round(clampNumber(body.maxPercent, 0, 100)),
    minutesWatched:
      Math.round(clampNumber(body.minutesWatched, 0, 600) * 10) / 10,
    completed: body.completed === true ? "Yes" : "No",
    device: text(body.device, 20),
    browser: text(body.browser, 40),
    pageUrl: text(body.pageUrl, 300),
  };

  try {
    const googleResponse = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(viewData),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const responseText = await googleResponse.text();
    let googleResult: { success?: boolean; message?: string } = {};

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video view API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "View could not be saved.",
      },
      { status: 500 },
    );
  }
}
