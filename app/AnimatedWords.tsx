"use client";

import { motion } from "motion/react";

import { REVEAL_RISE, REVEAL_TRANSITION, REVEAL_VIEWPORT } from "./revealMotion";

type AnimatedWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
};

// Words fade in one after another as the heading nears the screen
// (see revealMotion.ts).
export default function AnimatedWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.09,
}: AnimatedWordsProps) {
  const words = text.trim().split(/\s+/);

  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const word = {
    hidden: {
      opacity: 0,
      y: REVEAL_RISE,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: REVEAL_TRANSITION,
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      className={`inline-flex flex-wrap justify-center gap-x-[0.24em] gap-y-2 ${className}`}
      aria-label={text}
    >
      {words.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          variants={word}
          className={`reveal inline-block ${wordClassName}`}
          aria-hidden="true"
        >
          {item}
        </motion.span>
      ))}
    </motion.span>
  );
}
