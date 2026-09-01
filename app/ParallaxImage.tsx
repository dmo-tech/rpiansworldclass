"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ParallaxImage({
  src,
  alt,
  className = "",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-10%", "10%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [1.08, 1.08, 1.08] : [1.15, 1.05, 1.15],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y: imageY,
          scale: imageScale,
        }}
        className={`absolute -top-[10%] left-0 h-[120%] w-full object-cover will-change-transform ${className}`}
      />
    </div>
  );
}