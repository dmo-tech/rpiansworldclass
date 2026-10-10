"use client";

import { useEffect, useRef, useState } from "react";

import BookCallButton from "./BookCallButton";
import GatedVideoPlayer from "./GatedVideoPlayer";

// The Book a Call button below the video appears once the viewer has
// actually watched this many seconds of it (real watch time, not page time).
const BOOK_CALL_REVEAL_SECONDS = 90;

// Remembers the button was unlocked, since finishing the video clears the
// saved progress the player would otherwise restore it from.
const BOOK_CALL_UNLOCKED_KEY = "rpiansWatchBookCallUnlocked";

// /watch (the homepage video card links here): the player with its details
// form already open, on every visit. Submitting the form starts the video,
// from where the viewer last stopped. The Book a Call button below the video
// appears after BOOK_CALL_REVEAL_SECONDS of watching.

export default function WatchExperience() {
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

        <BookCallButton
          from="Watch - Below Video"
          className="mt-4 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-12 py-5 text-xl font-bold text-white! shadow-xl shadow-blue-600/30 transition hover:scale-105 sm:w-auto"
        />
      </div>
    </section>
  );
}
