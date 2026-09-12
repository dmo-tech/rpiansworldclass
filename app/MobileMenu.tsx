"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/systems",
    label: "Systems",
  },
  {
    href: "/journey",
    label: "Journey",
  },
  {
    href: "/results",
    label: "Results",
  },
  {
    href: "/about",
    label: "About",
  },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#3b82f6]/40 text-2xl text-[#3b82f6]"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full w-full border-t border-black/10 bg-white px-6 py-6 shadow-2xl">
          <nav className="flex flex-col gap-5 text-base text-gray-600">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="hover:text-[#3b82f6]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/register"
              onClick={closeMenu}
              className="rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-5 py-3 text-center font-bold text-white"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
