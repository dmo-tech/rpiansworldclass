"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const programs = [
  {
    href: "/programs/1-day",
    label: "1 Day Program",
  },
  {
    href: "/programs/1-month",
    label: "1 Month Program",
  },
  {
    href: "/programs/10-month",
    label: "10 Month Program",
  },
];

export default function ProgramsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
      >
        Our Programs
        <span
          className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl">
          {programs.map((program) => (
            <Link
              key={program.href}
              href={program.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm text-gray-700 transition hover:bg-[#3b82f6]/10 hover:text-[#1d4ed8]"
            >
              {program.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
