// Single source for the RPIANS phone / WhatsApp number (country code + number,
// digits only). Every WhatsApp button, tel: link and displayed number uses it.
// Change it here only.
export const WHATSAPP_NUMBER = "917049561975";

// Shown on the site as "+91 70495 61975".
export const CONTACT_PHONE = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 7)} ${WHATSAPP_NUMBER.slice(7)}`;

export const CONTACT_PHONE_TEL = `tel:+${WHATSAPP_NUMBER}`;

export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WHATSAPP_URL = `${WHATSAPP_BASE_URL}?text=Namaste%20RPIANS%20Team,%20mujhe%20Business%20Automation%20aur%20Profit%20Growth%20ke%20baare%20mein%20jankari%20chahiye.`;

// Homepage / "Watch the Transformation" video, hosted on worldclassbc.com.
// Upload a new encode under a new file name and change it here only.
export const VIDEO_URL =
  "https://worldclassbc.com/media/rpians-transformation-v20-web.mp4";
export const VIDEO_POSTER_URL =
  "https://worldclassbc.com/media/rpians-transformation-v20-poster.jpg";
