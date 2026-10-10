"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import BookCallButton from "./BookCallButton";
import GatedVideoPlayer, { GatedVideoPlayerHandle } from "./GatedVideoPlayer";

// The Book a Call button below the video appears once the viewer has
// actually watched this many seconds of it (real watch time, not page time).
const BOOK_CALL_REVEAL_SECONDS = 90;

// Remembers the button was unlocked, since finishing the video clears the
// saved progress the player would otherwise restore it from.
const BOOK_CALL_UNLOCKED_KEY = "rpiansWatchBookCallUnlocked";

// /watch: a minimal landing with one "Get Started" button. It opens the
// player's details form (or plays straight away for a saved viewer), then
// the landing makes way for the player and the Book a Call button.

export default function WatchExperience() {
  const playerRef = useRef<GatedVideoPlayerHandle>(null);
  const bookCallRef = useRef<HTMLDivElement>(null);
  const isBookCallShownRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBookCallShown, setIsBookCallShown] = useState(false);

  // Runs inside the click / submit, right before video.play(). flushSync
  // puts the player on screen first so mobile browsers play it with sound.
  const reveal = () => {
    flushSync(() => setIsRevealed(true));
    window.scrollTo({ top: 0 });
  };

  const showBookCall = () => {
    isBookCallShownRef.current = true;
    setIsBookCallShown(true);
  };

  const handleWatchTime = (seconds: number) => {
    if (isBookCallShownRef.current || seconds < BOOK_CALL_REVEAL_SECONDS) {
      return;
    }

    showBookCall();

    try {
      localStorage.setItem(BOOK_CALL_UNLOCKED_KEY, "1");
    } catch {
      // Private mode: it's still shown for this visit.
    }

    // On phones, bring it into view once if it's below the screen. Scrolling
    // doesn't pause the video; skipped while the player is fullscreen.
    const element = bookCallRef.current;

    if (
      element &&
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
    <>
      {!isRevealed && (
        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-10 text-center sm:pt-16">
          <p className="rounded-full bg-[#3b82f6]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#1d4ed8] sm:text-xs">
            Discover the RPIANS System
          </p>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.1] text-[#0f172a] sm:text-6xl md:text-7xl">
            Watch How Business Owners{" "}
            <span className="text-[#1d4ed8]">Transform Their Business</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#2563eb] sm:text-xl">
            Learn how systems, dashboards, accountability and implementation
            convert an owner-dependent business into a system-driven
            organisation.
          </p>

          <button
            type="button"
            onClick={() => playerRef.current?.open()}
            className="mt-10 w-full max-w-sm rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-10 py-5 text-xl font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 sm:w-auto"
          >
            Get Started
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Free video · about 23 minutes
          </p>
        </section>
      )}

      {/* Mounted from the start so the video element exists when play() is
          called from the Get Started click / form submit. */}
      <section
        className={
          isRevealed
            ? "mx-auto w-full max-w-5xl px-4 pb-10 pt-4 sm:pt-6"
            : "hidden"
        }
      >
        {/* On short screens the video shrinks to the screen height so the
            Book a Call button below it is visible without scrolling. */}
        <div className="mx-auto max-w-[max(20rem,calc((100dvh-18rem)*16/9))]">
          <GatedVideoPlayer
            ref={playerRef}
            onReveal={reveal}
            onWatchTime={handleWatchTime}
          />
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
    </>
  );
}
