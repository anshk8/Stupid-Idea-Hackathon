"use client";

import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = 72, className = "", priority = false }: Props) {
  return (
    <Image
      src="/swearlingo.png"
      alt="SwearLingo"
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
