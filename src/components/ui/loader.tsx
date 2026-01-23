"use client";

import Image from "next/image";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: 24,
  md: 32,
  lg: 40,
};

export function Loader({ size = "md", className = "" }: LoaderProps) {
  return (
    <Image
      src="/assets/sparkle-leaves-logo.svg"
      alt="Loading"
      width={sizes[size]}
      height={sizes[size]}
      className={`animate-spin ${className}`}
    />
  );
}
