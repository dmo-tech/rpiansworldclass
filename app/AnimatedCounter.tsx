"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, {
    amount: 0.7,
    once: false,
  });

  const motionValue = useMotionValue(0);

  const springValue = useSpring(motionValue, {
    stiffness: 55,
    damping: 18,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.round(latest).toLocaleString("en-IN"),
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    } else {
      motionValue.set(0);
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}

      <motion.span>{displayValue}</motion.span>

      {suffix}
    </span>
  );
}