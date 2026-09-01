"use client";

import { motion, useReducedMotion } from "motion/react";

type AnimatedWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

export default function AnimatedWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.09,
  once = false,
}: AnimatedWordsProps) {
  const reduceMotion = useReducedMotion();
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
      y: 45,
      rotateX: 70,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount: 0.7,
      }}
      className={`inline-flex flex-wrap justify-center gap-x-[0.24em] gap-y-2 ${className}`}
      aria-label={text}
    >
      {words.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          variants={word}
          className={`inline-block origin-bottom ${wordClassName}`}
          aria-hidden="true"
        >
          {item}
        </motion.span>
      ))}
    </motion.span>
  );
}