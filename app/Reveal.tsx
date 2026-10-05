"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  className?: string;
  once?: boolean;
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = false,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const hiddenStates = {
    up: { opacity: 0, y: 90 },
    down: { opacity: 0, y: -90 },
    // Only vertical motion, so boxes never shift off the shared container edges.
    left: { opacity: 0, y: 60 },
    right: { opacity: 0, y: 60 },
    scale: { opacity: 0, y: 40 },
  };

  return (
    <motion.div
      initial={reduceMotion ? false : hiddenStates[direction]}
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        once,
        amount: 0.18,
        margin: "0px 0px -70px 0px",
      }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}