// Single source for the RPIANS phone / WhatsApp number (country code + number,
// digits only). Every WhatsApp button, tel: link and displayed number uses it.
// Change it here only.
export const WHATSAPP_NUMBER = "917049561975";

// Shown on the site as "+91 70495 61975".
export const CONTACT_PHONE = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 7)} ${WHATSAPP_NUMBER.slice(7)}`;

export const CONTACT_PHONE_TEL = `tel:+${WHATSAPP_NUMBER}`;

export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// The general pre-filled WhatsApp message: footer
// "Chat on WhatsApp", /contact and the Thank You page. Line breaks become %0A
// in the link, so WhatsApp shows the three parts on separate lines.
const WHATSAPP_MESSAGE = [
  "Hello RPIANS Team,",
  "",
  "I want more information about Business Automation and Profit Growth.",
  "",
  "Thank you.",
].join("\n");

export const WHATSAPP_URL = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Homepage / "Watch the Transformation" video, hosted on worldclassbc.com.
// Upload a new encode under a new file name and change it here only.
export const VIDEO_URL =
  "https://worldclassbc.com/media/rpians-transformation-v20-web.mp4";
export const VIDEO_POSTER_URL =
  "https://worldclassbc.com/media/rpians-transformation-v20-poster.jpg";
