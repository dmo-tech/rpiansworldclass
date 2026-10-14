"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import { CalendarIcon } from "./BookCallButton";
import GatedVideoPlayer, { VIEWER_KEY } from "./GatedVideoPlayer";
import { plans } from "./plans";

// The Book a Call button below the video appears once the viewer has
// actually watched this many seconds of it (real watch time, not page time).
const BOOK_CALL_REVEAL_SECONDS = 90;

// Remembers the button was unlocked, since finishing the video clears the
// saved progress the player would otherwise restore it from.
const BOOK_CALL_UNLOCKED_KEY = "rpiansWatchBookCallUnlocked";

const BOOK_CALL_FROM = "Watch - Below Video";

// A booked call is paid for as the "Book a Strategy Call" plan (₹999).
const STRATEGY_CALL_PLAN = plans.find((plan) => plan.id === "strategy-call");

// /watch (the homepage video card links here): the player with its details
// form already open, on every visit. Submitting the form starts the video,
// from where the viewer last stopped. The Book a Call button below the video
// appears after BOOK_CALL_REVEAL_SECONDS of watching.
//
// Book a Call goes straight to /payment with the name, WhatsApp and email
// from the video form (the booking /payment reads from sessionStorage); the
// company and the call time are asked in the application form after paying.
// Without those details (storage blocked) it opens /book-call as before.

export default function WatchExperience() {
  const router = useRouter();
  const bookCallRef = useRef<HTMLDivElement>(null);
  const isBookCallShownRef = useRef(false);
  const [isBookCallShown, setIsBookCallShown] = useState(false);

  const showBookCall = () => {
    isBookCallShownRef.current = true;
    setIsBookCallShown(true);
  };

  const handleWatchTime = (seconds: number, fromSavedProgress: boolean) => {
    if (isBookCallShownRef.current || seconds < BOOK_CALL_REVEAL_SECONDS) {
      return;
    }

    showBookCall();

    try {
      localStorage.setItem(BOOK_CALL_UNLOCKED_KEY, "1");
    } catch {
      // Private mode: it's still shown for this visit.
    }

    // On phones, bring it into view once if it's below the screen. Only when
    // it unlocks during playback (not on page load); scrolling doesn't pause
    // the video, and it's skipped while the player is fullscreen.
    const element = bookCallRef.current;

    if (
      element &&
      !fromSavedProgress &&
      !document.fullscreenElement &&
      element.getClientRects().length > 0 &&
      element.getBoundingClientRect().bottom > window.innerHeight &&
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches
    ) {
      element.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
        block: "nearest",
      });
    }
  };

  const startBooking = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      const viewer = JSON.parse(localStorage.getItem(VIEWER_KEY) ?? "null");

      if (!viewer?.fullName || !viewer.phone || !viewer.email || !STRATEGY_CALL_PLAN) {
        throw new Error("No video form details saved.");
      }

      sessionStorage.setItem(
        "rpiansApplicationData",
        JSON.stringify({
          fullName: viewer.fullName,
          phone: viewer.phone,
          email: viewer.email,
          companyName: "",
          planId: STRATEGY_CALL_PLAN.id,
          planSelected: STRATEGY_CALL_PLAN.label,
          bookingAmount: STRATEGY_CALL_PLAN.amount,
          gstApplicable: STRATEGY_CALL_PLAN.gstApplicable ?? false,
          submittedAt: new Date().toISOString(),
          source: `RPIANS Website - ${BOOK_CALL_FROM}`,
        }),
      );
    } catch {
      event.preventDefault();
      router.push(`/book-call?from=${encodeURIComponent(BOOK_CALL_FROM)}`);
    }
  };

  useEffect(() => {
    try {
      if (localStorage.getItem(BOOK_CALL_UNLOCKED_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
        showBookCall();
      }
    } catch {
      // Storage blocked: falls back to the watch time.
    }
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-10 pt-4 sm:pt-6">
      <h1 className="sr-only">
        Watch How Business Owners Transform Their Business
      </h1>

      {/* On short screens the video shrinks to the screen height so the
          Book a Call button below it is visible without scrolling. */}
      <div className="mx-auto max-w-[max(20rem,calc((100dvh-18rem)*16/9))]">
        <GatedVideoPlayer openFormOnLoad onWatchTime={handleWatchTime} />
      </div>

      {/* Keeps its space while hidden so nothing jumps when it fades in. */}
      <div
        ref={bookCallRef}
        className={`mt-6 flex scroll-mb-4 flex-col items-center text-center transition-[opacity,translate,visibility] duration-700 ease-out motion-reduce:transition-none ${
          isBookCallShown
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-4 opacity-0 motion-reduce:translate-y-0"
        }`}
      >
        <p className="max-w-xl text-lg font-semibold text-[#0f172a] sm:text-xl">
          Ready to build a system-driven business?
        </p>

        <Link
          href="/payment"
          onClick={startBooking}
          className="mt-4 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-12 py-5 text-xl font-bold text-white! shadow-xl shadow-blue-600/30 transition hover:scale-105 sm:w-auto"
        >
          <CalendarIcon />
          Book a Call
        </Link>
      </div>
    </section>
  );
}
