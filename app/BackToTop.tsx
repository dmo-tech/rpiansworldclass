"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{
            opacity: 0,
            scale: 0.7,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.7,
            y: 20,
          }}
          whileHover={{
            scale: 1.1,
            y: -3,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            duration: 0.3,
          }}
          className="fixed bottom-24 right-7 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#22c55e]/50 bg-[#0a0e1a]/90 text-xl text-[#22c55e] shadow-[0_10px_30px_rgba(34, 197, 94, 0.25)] backdrop-blur transition hover:border-[#22c55e]"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}