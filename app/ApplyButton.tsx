"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type ApplyButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function ApplyButton({
  children,
  className = "",
}: ApplyButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/register")}
      className={className}
    >
      {children}
    </button>
  );
}