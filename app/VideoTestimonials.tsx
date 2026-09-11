"use client";

import { useRef, useState } from "react";

type VideoTestimonial = {
  src: string;
  name: string;
  title: string;
};

const videoTestimonials: VideoTestimonial[] = [
  {
    src: "/videos/amit-dhote.mp4",
    name: "Amit Dhote",
    title: "Founder, Vijay Traders",
  },
  {
    src: "/videos/jeetu-hardware.mp4",
    name: "Jeetu Ji",
    title: "Hardware Merchant",
  },
  {
    src: "/videos/mitesh-lalwani.mp4",
    name: "Mitesh Lalwani",
    title: "Distributor of Plywood",
  },
  {
    src: "/videos/vinay-pamnani.mp4",
    name: "Vinay Pamnani",
    title: "Distributor of Hardware",
  },
];

function VideoCard({ video }: { video: VideoTestimonial }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black transition hover:border-[#d9a441]/50">
      <div className="relative aspect-video bg-neutral-900">
        <video
          ref={videoRef}
          src={video.src}
          controls={isPlaying}
          playsInline
          className="h-full w-full object-contain"
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play testimonial video from ${video.name}`}
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/10"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] text-2xl text-black shadow-lg">
              ▶
            </span>
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-white">{video.name}</h3>
        <p className="mt-1 text-sm text-gray-400">{video.title}</p>
      </div>
    </div>
  );
}

export default function VideoTestimonials() {
  return (
    <section
      id="video-testimonials"
      className="border-y border-white/10 bg-white/[0.02] px-6 py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
            Client Testimonials
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-6xl">
            Our Happy Business Owners Sharing
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videoTestimonials.map((video) => (
            <VideoCard key={video.src} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
