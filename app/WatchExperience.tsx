"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
// Book a Call first asks whether the viewer has watched the full video. "Yes"
// goes straight to /payment with the name, WhatsApp and email from the video
// form (the booking /payment reads from sessionStorage); the company and the
// call time are asked in the application form after paying. Without those
// details (storage blocked) it opens /book-call as before. "No" closes the
// popup and scrolls back up to the video.

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export default function WatchExperience() {
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const bookCallRef = useRef<HTMLDivElement>(null);
  const isBookCallShownRef = useRef(false);
  const [isBookCallShown, setIsBookCallShown] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  // Saves the booking for /payment; false if the video form details are
  // missing or storage is blocked.
  const saveBooking = () => {
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

      return true;
    } catch {
      return false;
    }
  };

  const continueToBooking = () => {
    router.push(
      saveBooking()
        ? "/payment"
        : `/book-call?from=${encodeURIComponent(BOOK_CALL_FROM)}`,
    );
  };

  const backToVideo = () => {
    setIsConfirmOpen(false);

    // On the next frame, once the popup has closed and the page can scroll.
    requestAnimationFrame(() => {
      videoRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    });
  };

  useEffect(() => {
    if (!isConfirmOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isConfirmOpen]);

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
      <div
        ref={videoRef}
        className="mx-auto max-w-[max(20rem,calc((100dvh-18rem)*16/9))]"
      >
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

        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          aria-haspopup="dialog"
          className="mt-4 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-12 py-5 text-xl font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 sm:w-auto"
        >
          <CalendarIcon />
          Book a Call
        </button>
      </div>

      {isConfirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsConfirmOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="watch-confirm-title"
              aria-describedby="watch-confirm-text"
              onClick={(event) => event.stopPropagation()}
              className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-1 ring-amber-200">
                <WarningIcon />
              </div>

              <h2
                id="watch-confirm-title"
                className="mt-5 font-serif text-2xl font-bold text-gray-900 sm:text-3xl"
              >
                One Important Thing
              </h2>

              <p
                id="watch-confirm-text"
                className="mt-3 text-base leading-relaxed text-gray-600"
              >
                Before you go ahead, please watch the{" "}
                <strong className="font-semibold text-[#2563eb]">
                  full video
                </strong>{" "}
                above. Only then will you know which plan is right for your
                business.
              </p>

              <button
                type="button"
                onClick={continueToBooking}
                autoFocus
                className="mt-6 w-full text-balance rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02]"
              >
                Yes, I&apos;ve watched the full video
              </button>

              <button
                type="button"
                onClick={backToVideo}
                className="mt-3 w-full text-balance rounded-xl border border-gray-300 px-5 py-3.5 text-base font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                No, I haven&apos;t watched it. Take me back to the video
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
