"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
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

export default function ActiveNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-4 text-sm text-gray-300 lg:flex xl:gap-6">
      {navigationItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative whitespace-nowrap py-2 transition duration-300 ${
              isActive
                ? "text-[#f1c363]"
                : "text-gray-300 hover:text-[#d9a441]"
            }`}
          >
            {item.label}

            <span
              className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#b67b20] to-[#f1c363] transition-all duration-300 ${
                isActive ? "w-full" : "w-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
