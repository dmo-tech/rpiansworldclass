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
  {
    href: "/masterclass",
    label: "Masterclass",
  },
  {
    href: "/contact",
    label: "Contact",
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
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#d9a441]/40 text-2xl text-[#d9a441]"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full w-full border-t border-white/10 bg-black px-6 py-6 shadow-2xl">
          <nav className="flex flex-col gap-5 text-base text-gray-300">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="hover:text-[#d9a441]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/register"
              onClick={closeMenu}
              className="rounded-lg bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-5 py-3 text-center font-bold text-black"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
