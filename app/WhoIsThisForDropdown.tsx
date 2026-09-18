"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const businessTypes = [
  {
    href: "/results/retailer",
    label: "Retailer",
  },
  {
    href: "/results/distributors",
    label: "Distributors",
  },
  {
    href: "/results/wholesalers",
    label: "Wholesalers",
  },
  {
    href: "/results/manufacturers",
    label: "Manufacturers",
  },
  {
    href: "/results/project-based",
    label: "Project Based",
  },
  {
    href: "/results/service-based",
    label: "Service Based",
  },
  {
    href: "/results/export-import",
    label: "Export - Import",
  },
];

export default function WhoIsThisForDropdown() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = pathname.startsWith("/results");

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
        className={`relative flex items-center gap-1 whitespace-nowrap py-2 transition duration-300 ${
          isActive ? "text-[#22c55e]" : "text-gray-600 hover:text-[#3b82f6]"
        }`}
      >
        Who Is This For
        <span
          className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
        <span
          className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#ef4444] to-[#22c55e] transition-all duration-300 ${
            isActive ? "w-full" : "w-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl">
          {businessTypes.map((type) => {
            const itemIsActive = pathname === type.href;

            return (
              <Link
                key={type.href}
                href={type.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm transition hover:bg-[#3b82f6]/10 hover:text-[#1d4ed8] ${
                  itemIsActive ? "text-[#1d4ed8]" : "text-gray-700"
                }`}
              >
                {type.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
