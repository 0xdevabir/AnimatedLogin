"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
};

export function TiltCard({ children, className, intensity = 12, glow = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 220,
    damping: 18,
    mass: 0.4,
  });
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 220,
    damping: 18,
    mass: 0.4,
  });

  const gX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const gY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60"
          style={{
            background: useTransform(
              [gX, gY] as never,
              ([x, y]) =>
                `radial-gradient(600px 300px at ${x} ${y}, color-mix(in oklch, var(--primary) 30%, transparent), transparent 60%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}
