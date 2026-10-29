import Script from "next/script";
import type { ReactNode } from "react";

import type { ConsentCategory, CookieConsent } from "./cookieConsent";
import { META_PIXEL_READY_EVENT } from "./metaPixel";

// Every analytics / marketing script on the site, in one list. ConsentScripts
// loads an entry only after the visitor accepts its category, and only when
// its ID is set (NEXT_PUBLIC_* variables are read at build time, so set them
// in Hostinger before the build; .env.example lists them).
//
// To add a new tool: add an entry here with its category, its ID, the cookie
// name prefixes it sets (removed if the visitor later withdraws consent) and
// the script itself (next/script; inline scripts need a unique id). Then list
// its cookies on /cookie-policy.

type Tracker = {
  name: string;
  category: ConsentCategory;
  id: string | undefined;
  cookiePrefixes: string[];
  script: (id: string, consent: CookieConsent) => ReactNode;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Google Consent Mode: Google Analytics and Google Ads share one gtag, so
// each is told what the other category allows (GA must not set ad cookies
// when only Analytics was accepted).
export const googleConsentState = (consent: CookieConsent) => ({
  analytics_storage: consent.analytics ? "granted" : "denied",
  ad_storage: consent.marketing ? "granted" : "denied",
  ad_user_data: consent.marketing ? "granted" : "denied",
  ad_personalization: consent.marketing ? "granted" : "denied",
});

// Defines gtag (both Google tags include it, whichever runs first) and sets
// the consent state before any config.
const googleTagSetup = (consent: CookieConsent) =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
  `if(!window.__rpiansGtagReady){window.__rpiansGtagReady=true;gtag("consent","default",${JSON.stringify(googleConsentState(consent))});gtag("js",new Date());}`;

// Only letters, digits and dashes, so an ID can't break out of the inline script.
const cleanId = (value: string | undefined) => {
  const id = value?.trim();
  return id && /^[A-Za-z0-9-]+$/.test(id) ? id : undefined;
};

export const TRACKERS: Tracker[] = [
  {
    name: "Google Analytics",
    category: "analytics",
    id: cleanId(process.env.NEXT_PUBLIC_GA_ID),
    cookiePrefixes: ["_ga", "_gid", "_gat"],
    // Page views on in-site navigation come from GA4's enhanced measurement
    // ("page changes based on browser history events", on by default).
    script: (id, consent) => (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`${googleTagSetup(consent)}gtag("config",${JSON.stringify(id)});`}
        </Script>
      </>
    ),
  },
  {
    name: "Microsoft Clarity",
    category: "analytics",
    id: cleanId(process.env.NEXT_PUBLIC_CLARITY_ID),
    cookiePrefixes: ["_clck", "_clsk"],
    script: (id) => (
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(id)});`}
      </Script>
    ),
  },
  {
    name: "Meta Pixel",
    category: "marketing",
    id: cleanId(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    cookiePrefixes: ["_fbp", "_fbc"],
    // The pixel sends a PageView on in-site navigation by itself (it follows
    // history changes), so only the first one is sent here. Lead, Purchase
    // and Contact come from metaPixel.ts, which waits for the ready event.
    // autoConfig off: the pixel's automatic button-click events can send a
    // clicked link's address, and the WhatsApp links carry the visitor's
    // name, phone and company in their message.
    script: (id) => (
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("set","autoConfig",false,${JSON.stringify(id)});fbq("init",${JSON.stringify(id)});fbq("track","PageView");window.dispatchEvent(new Event(${JSON.stringify(META_PIXEL_READY_EVENT)}));`}
      </Script>
    ),
  },
  {
    name: "Google Ads",
    category: "marketing",
    id: cleanId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
    cookiePrefixes: ["_gcl_"],
    script: (id, consent) => (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`${googleTagSetup(consent)}gtag("config",${JSON.stringify(id)});`}
        </Script>
      </>
    ),
  },
];
