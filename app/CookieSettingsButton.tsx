"use client";

import type { ReactNode } from "react";

import { openCookieSettings } from "./cookieConsent";

// Opens the cookie Customize panel (CookieBanner.tsx) from anywhere, e.g. the
// footer, so visitors can change their choice later.
export default function CookieSettingsButton({
  className,
  children = "Cookie Settings",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
