"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { MouseEvent, ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

export default function TiltCard({
  children,
  className = "",
}: TiltCardProps) {
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 180,
    damping: 22,
    mass: 0.5,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 180,
    damping: 22,
    mass: 0.5,
  });

  const rotateX = useTransform(
    smoothY,
    [-0.5, 0.5],
    reduceMotion ? [0, 0] : [7, -7],
  );

  const rotateY = useTransform(
    smoothX,
    [-0.5, 0.5],
    reduceMotion ? [0, 0] : [-7, 7],
  );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.025,
              y: -5,
            }
      }
      transition={{
        duration: 0.25,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}