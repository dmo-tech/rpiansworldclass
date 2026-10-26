// LeadGridd CRM: each "Enter your details to book your strategy call" form
// (ApplyCheckPopup, via /api/leads) is also added there as a contact. The API
// token comes from the LEADGRIDD_API_TOKEN environment variable, never from
// the code; without it nothing is sent.
const LEADGRIDD_CONTACTS_URL = "https://app.leadgridd.com/api/inbound/contacts";

const text = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

// Never throws: a failing CRM must not affect the visitor or the Sheet.
export async function sendToLeadGridd(lead: Record<string, unknown>) {
  const token = process.env.LEADGRIDD_API_TOKEN;

  if (!token) {
    console.error("LeadGridd: LEADGRIDD_API_TOKEN is not set; contact not sent.");
    return;
  }

  const name = text(lead.fullName, 100);
  const email = text(lead.email, 150);
  // 10-digit Indian mobile, as the form checks it.
  const phone = text(lead.phone, 20).replace(/\D/g, "");

  if (!name || !email || !/^[6-9]\d{9}$/.test(phone)) {
    console.error("LeadGridd: contact not sent, name / email / mobile missing or invalid.");
    return;
  }

  try {
    const response = await fetch(LEADGRIDD_CONTACTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phoneNumber: `+91${phone}`,
        countryCode: "+91",
        contactType: "LEAD",
        customAttributes: {
          annual_turnover: text(lead.revenue, 40),
          what_do_you_currently_do: text(lead.occupation, 40),
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(
        `LeadGridd: contact not added (${response.status}): ${(await response.text()).slice(0, 200)}`,
      );
    }
  } catch (error) {
    console.error("LeadGridd error:", error);
  }
}
