import { NextResponse } from "next/server";


  const GOOGLE_SHEET_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycby7gNgcO-id8ERU2igs7R8_oqRVr0gm9ZO8uvndLD3GEmvRywjH9yXvesrs1LwKjBY/exec";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const googleResponse = await fetch(
      GOOGLE_SHEET_WEB_APP_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(formData),
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

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

    return NextResponse.json({
      success: true,
      message: "Lead saved successfully.",
    });
  } catch (error) {
    console.error("Lead API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Lead could not be saved.",
      },
      {
        status: 500,
      },
    );
  }
}