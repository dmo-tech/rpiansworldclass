"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";

import { VIDEO_POSTER_URL } from "./siteConfig";

// Homepage video card, placed right after the hero so the first screen shows
// only the hero text. As soon as the visitor scrolls, the card rises in at
// about 60% size, grows to its final size over roughly one screen of
// scrolling (on the hero's light theme background, which the page wraps
// around both), then scrolls away with
// the page. Nothing is pinned. It never plays here; clicking it opens the
// gated player on /watch.
//
// Every value is computed in JavaScript from scroll progress (function
// transforms) on purpose: Motion can hand range-mapped values to the
// browser's native scroll timeline, which got this section's range wrong.

const MOBILE_QUERY = "(max-width: 767px)";

const START_SCALE = 0.6;
const CORNER_RADIUS = { desktop: 24, mobile: 18 };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Ease-out so the growth feels quick at first and settles gently.
const easeOut = (value: number) => 1 - (1 - value) ** 3;

const subscribeToMobile = (callback: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const useIsMobile = () =>
  useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );

function PlayIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.79-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function VideoCard({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/watch"
      aria-label="Watch the transformation video"
      className={`group relative block aspect-video w-full overflow-hidden rounded-[inherit] bg-neutral-900 ${className}`}
    >
      <Image
        src={VIDEO_POSTER_URL}
        alt="Rajesh Kumar Kare explaining the RPIANS business system"
        fill
        sizes="(max-width: 768px) 92vw, 1100px"
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] pl-1 text-white shadow-2xl shadow-blue-900/50 transition duration-300 group-hover:scale-110 sm:h-24 sm:w-24 md:h-28 md:w-28">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#3b82f6]/40 [animation-duration:2.2s]" />
          <PlayIcon className="relative h-7 w-7 sm:h-10 sm:w-10 md:h-12 md:w-12" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#93c5fd] sm:text-xs">
          Discover the RPIANS System
        </p>
        <p className="mt-1 font-serif text-lg font-semibold leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
          Watch How Business Owners Transform Their Business
        </p>
      </div>
    </Link>
  );
}

export default function HomeVideoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Grow: 0 = section top at the bottom of the screen (page load, hero
  // filling the screen), 1 = section top just under the fixed header.
  const { scrollYProgress: grow } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.1"],
  });

  const scale = useTransform(
    grow,
    (progress) => START_SCALE + (1 - START_SCALE) * easeOut(clamp01(progress)),
  );

  // Divided by the scale so the corners look the same size the whole time.
  const borderRadius = useTransform(
    scale,
    (value) =>
      (isMobile ? CORNER_RADIUS.mobile : CORNER_RADIUS.desktop) / value,
  );

  // A small extra lift on top of the normal scroll, so the card "rises".
  const y = useTransform(grow, (progress) => 24 * (1 - clamp01(progress)));

  if (reduceMotion) {
    return (
      <section
        ref={sectionRef}
        aria-label="Transformation video"
        className="relative py-16 md:py-24"
      >
        <div className="mx-auto w-[92vw] overflow-hidden rounded-[18px] md:w-[min(75vw,1100px)] md:rounded-[24px]">
          <VideoCard />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Transformation video"
      className="relative py-8 md:py-14"
    >
      <motion.div
        style={{ scale, y, borderRadius, transformOrigin: "50% 0%" }}
        className="relative z-10 mx-auto w-[92vw] overflow-hidden shadow-2xl shadow-blue-900/20 will-change-transform md:w-[min(75vw,1100px)]"
      >
        <VideoCard />
      </motion.div>
    </section>
  );
}
