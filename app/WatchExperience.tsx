"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import BookCallButton from "./BookCallButton";
import GatedVideoPlayer, { GatedVideoPlayerHandle } from "./GatedVideoPlayer";

// /watch: a minimal landing with one "Get Started" button. It opens the
// player's details form (or plays straight away for a saved viewer), then
// the landing makes way for the player and the Book a Call button.

export default function WatchExperience() {
  const playerRef = useRef<GatedVideoPlayerHandle>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Runs inside the click / submit, right before video.play(). flushSync
  // puts the player on screen first so mobile browsers play it with sound.
  const reveal = () => {
    flushSync(() => setIsRevealed(true));
    window.scrollTo({ top: 0 });
  };

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
            ? "mx-auto w-full max-w-5xl px-4 pb-16 pt-4 sm:pt-8"
            : "hidden"
        }
      >
        <GatedVideoPlayer ref={playerRef} onReveal={reveal} />

        <div className="mt-10 flex flex-col items-center text-center">
          <p className="max-w-xl text-lg font-semibold text-[#0f172a] sm:text-xl">
            Ready to build a system-driven business?
          </p>

          <BookCallButton
            from="Watch - Below Video"
            className="mt-5 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-12 py-5 text-xl font-bold text-white! shadow-xl shadow-blue-600/30 transition hover:scale-105 sm:w-auto"
          />
        </div>
      </section>
    </>
  );
}
