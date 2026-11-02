import Image from "next/image";
import Link from "next/link";

import { VIDEO_POSTER_URL } from "./siteConfig";

// Homepage video card, placed right after the hero so it shows on the first
// screen, on the hero's light theme background (the page wraps it around both).
// It never plays here; clicking it opens the gated player on /watch.

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
        sizes="(max-width: 768px) 92vw, 960px"
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
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#93c5fd] max-[374px]:tracking-[0.1em] sm:text-xs sm:tracking-[0.3em]">
          Business Automation And Profit Mastery Strategy
        </p>
        <p className="mt-1 font-serif text-lg font-semibold leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
          Watch How Business Owners Transform Their Business
        </p>
      </div>
    </Link>
  );
}

export default function HomeVideoShowcase() {
  return (
    <section
      aria-label="Transformation video"
      className="relative pb-8 pt-2 md:pb-14"
    >
      {/* will-change only keeps the phone card on its own layer, as it has
          always been; without it the colours render very slightly differently. */}
      <div className="relative z-10 mx-auto w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/20 max-md:will-change-transform md:w-[min(75vw,960px)] md:rounded-[20px]">
        <VideoCard />
      </div>

      {/* Not a link: only the card above opens the video. */}
      <p className="relative z-10 mt-3 flex items-center justify-center gap-1 px-4 text-center text-[13px] font-normal tracking-wide text-gray-600 md:mt-4 md:gap-1.5 md:text-[15px]">
        <PlayIcon className="h-3 w-3 shrink-0 text-[#1d4ed8] md:h-3.5 md:w-3.5" />
        <span>
          <span className="font-semibold text-[#1d4ed8]">Watch this video</span>{" "}
          before you book a call
        </span>
      </p>
    </section>
  );
}
