"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { openApplyCheck, WATCH_VIDEO_ID } from "./applyFlow";
import { CalendarIcon } from "./BookCallButton";
import GatedVideoPlayer from "./GatedVideoPlayer";

// The Book a Call button below the video appears once the viewer has
// actually watched this many seconds of it (real watch time, not page time).
const BOOK_CALL_REVEAL_SECONDS = 90;

// Remembers the button was unlocked, since finishing the video clears the
// saved progress the player would otherwise restore it from.
const BOOK_CALL_UNLOCKED_KEY = "rpiansWatchBookCallUnlocked";

const BOOK_CALL_FROM = "Watch - Below Video";

// /watch (the homepage video card and the "One Important Thing" popup's "No"
// link here): the video, ready to play from where this browser last stopped,
// with no details form. The Book a Call button below it appears after
// BOOK_CALL_REVEAL_SECONDS of watching.
//
// Book a Call opens the "One Important Thing" popup (ApplyCheckPopup): "Yes"
// asks for the details, then /payment for the strategy call; the call time
// and the application form come after paying. "No" closes it and scrolls
// back up to the video.

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

  // Without the popup (never expected) the calendar page books the call.
  const handleBookCall = () => {
    if (!openApplyCheck(BOOK_CALL_FROM)) {
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
      <div
        id={WATCH_VIDEO_ID}
        className="mx-auto max-w-[max(20rem,calc((100dvh-18rem)*16/9))]"
      >
        <GatedVideoPlayer onWatchTime={handleWatchTime} />
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
          onClick={handleBookCall}
          aria-haspopup="dialog"
          className="mt-4 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-12 py-5 text-xl font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 sm:w-auto"
        >
          <CalendarIcon />
          Book a Call
        </button>
      </div>
    </section>
  );
}
