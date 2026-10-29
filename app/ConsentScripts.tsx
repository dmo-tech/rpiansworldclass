"use client";

import { Fragment, useEffect, useRef } from "react";

import {
  CONSENT_CATEGORIES,
  type CookieConsent,
  deleteCookiesStartingWith,
  useCookieConsent,
} from "./cookieConsent";
import { listenForWhatsAppClicks } from "./metaPixel";
import { googleConsentState, TRACKERS } from "./trackingScripts";

// Loads each tracking script from trackingScripts.tsx once its category is
// accepted; nothing loads before the visitor chooses.
export default function ConsentScripts() {
  const consent = useCookieConsent();
  const previousConsent = useRef<CookieConsent | null | undefined>(undefined);

  // Meta Pixel "Contact" on WhatsApp clicks (sent only with Marketing accepted).
  useEffect(() => listenForWhatsAppClicks(), []);

  useEffect(() => {
    const before = previousConsent.current;
    previousConsent.current = consent;

    if (!before || !consent) return;

    // A script that already ran can't be unloaded, so withdrawing a category
    // removes its cookies and reloads the page without it.
    const withdrawn = CONSENT_CATEGORIES.filter(
      (category) => before[category] && !consent[category],
    );

    if (withdrawn.length > 0) {
      deleteCookiesStartingWith(
        TRACKERS.filter((tracker) => withdrawn.includes(tracker.category)).flatMap(
          (tracker) => tracker.cookiePrefixes,
        ),
      );
      window.location.reload();
      return;
    }

    // Newly accepted: tell an already-loaded Google tag (new scripts below
    // start with the right state anyway).
    window.gtag?.("consent", "update", googleConsentState(consent));
  }, [consent]);

  if (!consent) return null;

  return TRACKERS.map(({ name, category, id, script }) =>
    id && consent[category] ? (
      <Fragment key={name}>{script(id, consent)}</Fragment>
    ) : null,
  );
}
