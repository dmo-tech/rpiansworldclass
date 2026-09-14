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
    label: "Who Is This For",
  },
  {
    href: "/about",
    label: "About",
  },
];

const programLinks = [
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
  {
    href: "/programs/personal-mentorship",
    label: "Personal Mentorship",
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

            <div className="border-t border-black/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Our Programs
              </p>

              <div className="mt-3 flex flex-col gap-4">
                {programLinks.map((program) => (
                  <Link
                    key={program.href}
                    href={program.href}
                    onClick={closeMenu}
                    className="hover:text-[#3b82f6]"
                  >
                    {program.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/register"
              onClick={closeMenu}
              className="rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-5 py-3 text-center font-bold text-white"
            >
              Apply Now
            </Link>

            <Link
              href="/login"
              onClick={closeMenu}
              className="rounded-lg border border-[#3b82f6]/35 px-5 py-3 text-center font-semibold text-[#1d4ed8]"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
