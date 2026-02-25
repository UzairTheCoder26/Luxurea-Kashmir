"use client";

import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        "border-2 border-gold/20 border-t-gold rounded-full animate-spin",
        {
          "w-6 h-6": size === "sm",
          "w-10 h-10": size === "md",
          "w-14 h-14": size === "lg",
        },
        className
      )}
    />
  );
}
