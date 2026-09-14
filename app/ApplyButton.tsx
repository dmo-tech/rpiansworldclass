"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type ApplyButtonProps = {
  children: ReactNode;
  className?: string;
  plan?: string;
};

export default function ApplyButton({
  children,
  className = "",
  plan,
}: ApplyButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(plan ? `/register?plan=${plan}` : "/register")
      }
      className={className}
    >
      {children}
    </button>
  );
}
