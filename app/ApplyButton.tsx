"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type ApplyButtonProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
};

export default function ApplyButton({
  children,
  className = "",
  amount,
}: ApplyButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(amount ? `/register?amount=${amount}` : "/register")
      }
      className={className}
    >
      {children}
    </button>
  );
}