import { useSyncExternalStore } from "react";

// The visitor's cookie choice, kept in the first-party "cookie_consent" cookie
// for 6 months. Essential storage (video resume, form → payment hand-off,
// Razorpay) never waits for it; only the categories below do.
// The banner and the Customize panel are in CookieConsent.tsx; the tracking
// scripts that wait for a category are listed in trackingScripts.tsx.

export const CONSENT_CATEGORIES = ["analytics", "marketing"] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type CookieConsent = Record<ConsentCategory, boolean>;

export const CONSENT_COOKIE = "cookie_consent";

// Bump when the categories change, so everyone is asked again.
const CONSENT_VERSION = 1;

const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 182;

export const ALL_ACCEPTED: CookieConsent = { analytics: true, marketing: true };
export const ONLY_ESSENTIAL: CookieConsent = { analytics: false, marketing: false };

const readCookie = (name: string) => {
  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix));

  return match ? match.slice(prefix.length) : null;
};

const parseConsent = (raw: string | null): CookieConsent | null => {
  if (!raw) return null;

  try {
    const saved = JSON.parse(decodeURIComponent(raw));

    if (
      saved?.v !== CONSENT_VERSION ||
      typeof saved.analytics !== "boolean" ||
      typeof saved.marketing !== "boolean"
    ) {
      return null;
    }

    return { analytics: saved.analytics, marketing: saved.marketing };
  } catch {
    return null;
  }
};

// useSyncExternalStore wants the same object back while nothing changed.
let cachedRaw: string | null = null;
let cachedConsent: CookieConsent | null = null;

// Also read outside React (metaPixel.ts): the choice saved right now.
export const getConsentSnapshot = () => {
  const raw = readCookie(CONSENT_COOKIE);

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedConsent = parseConsent(raw);
  }

  return cachedConsent;
};

// undefined during the server render, so "not read yet" differs from "no
// choice yet" (null) and the banner never flashes for visitors who chose.
const getServerConsentSnapshot = () => undefined;

const listeners = new Set<() => void>();

const subscribeToConsent = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function useCookieConsent() {
  return useSyncExternalStore<CookieConsent | null | undefined>(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
}

export function saveCookieConsent(consent: CookieConsent) {
  const value = encodeURIComponent(
    JSON.stringify({
      v: CONSENT_VERSION,
      analytics: consent.analytics,
      marketing: consent.marketing,
      date: new Date().toISOString(),
    }),
  );

  // Secure on the live site (https). Left off on http://, e.g. testing on a
  // phone over the local network, where the browser would drop the cookie.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${SIX_MONTHS_IN_SECONDS}; Path=/; SameSite=Lax${secure}`;

  listeners.forEach((listener) => listener());
}

// Deletes every cookie whose name starts with one of the prefixes, on this
// host and its parent domains (Google Analytics sets _ga on .worldclassbc.com).
export function deleteCookiesStartingWith(prefixes: string[]) {
  const labels = window.location.hostname.split(".");
  const domains = [""];

  for (let index = 0; index < labels.length - 1; index += 1) {
    domains.push(`; Domain=.${labels.slice(index).join(".")}`);
  }

  document.cookie.split("; ").forEach((cookie) => {
    const name = cookie.split("=")[0];

    if (!prefixes.some((prefix) => name.startsWith(prefix))) return;

    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
    });
  });
}

// "Cookie Settings" (footer, /cookie-policy) opens the Customize panel.
export const OPEN_COOKIE_SETTINGS_EVENT = "rpians:open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
