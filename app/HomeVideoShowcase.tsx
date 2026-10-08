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

// Homepage video card: as the visitor scrolls past the hero, the poster card
// rises and zooms to almost full width over a darkening background (sticky
// section driven by scroll progress). It never plays here; clicking it opens
// the gated player on /watch.

const MOBILE_QUERY = "(max-width: 767px)";

const subscribeToMobile = (callback: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

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
        sizes="(max-width: 768px) 92vw, 1280px"
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

  // 0 = section top reaches the bottom of the screen (hero still in view),
  // 1 = end of the pinned stretch.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.7 : 0.65],
    [isMobile ? 0.82 : 0.55, 1],
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.65],
    isMobile ? [20, 16] : [48, 28],
  );
  // Fades in while the card grows, out at the very end. A function (not
  // input/output ranges) on purpose: Motion hands range-mapped opacity to the
  // browser's native scroll timeline, which got this section's range wrong.
  const darkness = useTransform(
    scrollYProgress,
    (progress) => clamp01((progress - 0.2) / 0.35) * clamp01((1 - progress) / 0.1),
  );

  if (reduceMotion) {
    return (
      <section
        ref={sectionRef}
        aria-label="Transformation video"
        className="relative bg-[#0b1120] py-16 md:py-24"
      >
        <div className="site-container">
          <div className="overflow-hidden rounded-3xl">
            <VideoCard />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Transformation video"
      className="relative h-[180vh] md:h-[260vh]"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden pt-16 md:pt-20">
        <motion.div
          aria-hidden="true"
          style={{ opacity: darkness }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#132044_0%,#0b1120_55%,#05070d_100%)]"
        />

        <motion.div
          style={{
            scale,
            borderRadius,
            // Widest 16:9 card that still fits below the fixed header.
            width: "min(92vw, 1280px, calc((100dvh - 8rem) * 16 / 9))",
          }}
          className="relative overflow-hidden shadow-2xl shadow-black/40 will-change-transform"
        >
          <VideoCard />
        </motion.div>
      </div>
    </section>
  );
}
