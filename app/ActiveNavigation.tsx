"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ProgramsDropdown from "./ProgramsDropdown";
import WhoIsThisForDropdown from "./WhoIsThisForDropdown";

const beforeItems = [
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
];

const afterItems = [
  {
    href: "/about",
    label: "About",
  },
];

export default function ActiveNavigation() {
  const pathname = usePathname();

  const renderItem = (item: { href: string; label: string }) => {
    const isActive =
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`relative whitespace-nowrap py-2 transition duration-300 ${
          isActive ? "text-[#22c55e]" : "text-gray-600 hover:text-[#3b82f6]"
        }`}
      >
        {item.label}

        <span
          className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#ef4444] to-[#22c55e] transition-all duration-300 ${
            isActive ? "w-full" : "w-0"
          }`}
        />
      </Link>
    );
  };

  return (
    <nav className="hidden items-center gap-4 text-sm text-gray-600 lg:flex xl:gap-6">
      {beforeItems.map(renderItem)}

      <WhoIsThisForDropdown />

      {afterItems.map(renderItem)}

      <ProgramsDropdown />
    </nav>
  );
}
