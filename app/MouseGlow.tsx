"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

export default function MouseGlow() {
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 24,
    mass: 0.8,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 24,
    mass: 0.8,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX - 220);
      mouseY.set(event.clientY - 220);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[440px] w-[440px] rounded-full bg-[#d9a441]/10 blur-[120px] lg:block"
    />
  );
}