"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

// The URL doesn't change while the page is open; nothing to subscribe to.
const subscribeToNothing = () => () => {};

// Set by the "refund policy" link on /payment.
const cameFromPayment = () =>
  new URLSearchParams(window.location.search).get("from") === "payment";

export default function BackToPaymentButton() {
  const router = useRouter();
  const isVisible = useSyncExternalStore(
    subscribeToNothing,
    cameFromPayment,
    () => false,
  );

  if (!isVisible) return null;

  const goBackToPayment = () => {
    const referrer = document.referrer ? new URL(document.referrer) : null;

    // Arrived from /payment in this tab: going back restores it as it was.
    // Otherwise open it fresh; it reloads the booking from sessionStorage.
    if (
      referrer?.origin === window.location.origin &&
      referrer.pathname === "/payment" &&
      window.history.length > 1
    ) {
      router.back();
    } else {
      router.push("/payment");
    }
  };

  return (
    <button
      type="button"
      onClick={goBackToPayment}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition hover:scale-[1.03]"
    >
      ← Back to Payment
    </button>
  );
}
