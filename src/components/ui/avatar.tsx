"use client";

import * as React from "react";
import { cn, initials } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
  size?: number;
};

export function Avatar({ name, src, className, size = 40 }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-soft)]",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span
          className="text-[11px] font-semibold"
          style={{
            background: "var(--gradient-brand)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}
