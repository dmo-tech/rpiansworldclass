import { getConsentSnapshot } from "./cookieConsent";
import type { PaymentReceipt } from "./paymentReceipt";

// Meta Pixel events. The pixel itself (with its PageView) loads from
// trackingScripts.tsx once the visitor accepts Marketing cookies. An event
// here is sent only when Marketing is accepted and the pixel is on the page;
// while the pixel is still loading, the event waits for it. No event carries
// the visitor's name, phone, email or any other personal detail.
//
//   Lead      a form sent to /api/leads was saved (trackLeadIfSaved)
//   Purchase  a payment the server verified, once per payment ID (/thank-you)
//   Contact   a click on any WhatsApp link (listenForWhatsAppClicks), or the
//             /register WhatsApp button

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Fbq = NonNullable<Window["fbq"]>;

// Sent by the pixel snippet in trackingScripts.tsx right after it defines fbq.
export const META_PIXEL_READY_EVENT = "rpians:meta-pixel-ready";

function whenPixelReady(send: (fbq: Fbq) => void) {
  if (getConsentSnapshot()?.marketing !== true) return;

  if (window.fbq) {
    send(window.fbq);
    return;
  }

  window.addEventListener(
    META_PIXEL_READY_EVENT,
    () => {
      if (window.fbq) send(window.fbq);
    },
    { once: true },
  );
}

export const trackLead = () => whenPixelReady((fbq) => fbq("track", "Lead"));

// fetch("/api/leads", …).then(trackLeadIfSaved): a Lead only when the server
// answers that the lead was saved, never on an error.
export async function trackLeadIfSaved(response: Response) {
  if (!response.ok) return;

  try {
    const result = await response.json();

    if (result?.success === true) trackLead();
  } catch {
    // Not JSON: not saved.
  }
}

// Payment IDs this browser already sent as a Purchase (the latest 20), so a
// refresh of /thank-you, or the same receipt in another tab, doesn't send it
// again. Also kept in memory for when storage is blocked.
const PURCHASES_KEY = "rpiansPixelPurchases";
const sentPurchases = new Set<string>();

const readSentPurchases = (): string[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(PURCHASES_KEY) ?? "[]");

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const isPurchaseSent = (paymentId: string) =>
  sentPurchases.has(paymentId) || readSentPurchases().includes(paymentId);

export function trackPurchase({ paymentId, amount, planName }: PaymentReceipt) {
  if (isPurchaseSent(paymentId)) return;

  whenPixelReady((fbq) => {
    // Checked again: two waits for the same payment can't both send it.
    if (isPurchaseSent(paymentId)) return;

    sentPurchases.add(paymentId);

    try {
      localStorage.setItem(
        PURCHASES_KEY,
        JSON.stringify([...readSentPurchases(), paymentId].slice(-20)),
      );
    } catch {
      // Private mode: only this page remembers it.
    }

    fbq("track", "Purchase", {
      value: amount,
      currency: "INR",
      content_name: planName,
    });
  });
}

export const trackContact = () =>
  whenPixelReady((fbq) => fbq("track", "Contact"));

const isWhatsAppUrl = (href: string) => {
  try {
    const url = new URL(href);

    return (
      url.protocol === "whatsapp:" ||
      url.hostname === "wa.me" ||
      url.hostname === "whatsapp.com" ||
      url.hostname.endsWith(".whatsapp.com")
    );
  } catch {
    return false;
  }
};

// One listener for every WhatsApp link on the site: a click on any of them
// is a Contact. Returns the cleanup.
export function listenForWhatsAppClicks() {
  const onClick = (event: MouseEvent) => {
    const link =
      event.target instanceof Element ? event.target.closest("a[href]") : null;

    if (link instanceof HTMLAnchorElement && isWhatsAppUrl(link.href)) {
      trackContact();
    }
  };

  // Capture, so a handler that stops the click can't hide it.
  document.addEventListener("click", onClick, true);

  return () => document.removeEventListener("click", onClick, true);
}
