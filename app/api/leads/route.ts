import { NextResponse } from "next/server";
import { saveToGoogleSheet, sheetNameForLead } from "../../googleSheet";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 },
      );
    }

    // Any sheetName from the browser is dropped; the server picks the tab.
    const fields = { ...(body as Record<string, unknown>) };
    delete fields.sheetName;

    const formData = {
      ...fields,
      sheetName: sheetNameForLead(fields.formType),
    };

    await saveToGoogleSheet(formData);

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