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
    left: { opacity: 0, x: -100 },
    right: { opacity: 0, x: 100 },
    scale: { opacity: 0, scale: 0.86 },
  };

  return (
    <motion.div
      initial={reduceMotion ? false : hiddenStates[direction]}
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
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