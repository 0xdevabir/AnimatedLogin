"use client";

import { motion, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 22, mass: 0.3 });
  const bg = useMotionTemplate`radial-gradient(380px circle at ${sx}px ${sy}px, color-mix(in oklch, var(--primary) 12%, transparent), transparent 60%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md",
        className
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
