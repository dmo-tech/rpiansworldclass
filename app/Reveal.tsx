"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { revealMotion } from "./revealMotion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  className?: string;
};

// Each item already starts on its own as it nears the screen, so the delay
// only staggers a short cascade. Longer waits (index * 0.08 down a long list)
// left items blank on screen.
const MAX_DELAY = 0.2;

// Fades its children in as they near the screen (see revealMotion.ts).
// Every direction is the same small rise (only vertical, so boxes never
// shift off the shared container edges), except "down", which drops in.
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  return (
    <motion.div
      {...revealMotion(Math.min(delay, MAX_DELAY), direction === "down" ? -1 : 1)}
      className={`reveal ${className}`}
    >
      {children}
    </motion.div>
  );
}
