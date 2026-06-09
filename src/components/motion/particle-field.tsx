"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 4,
  }));
}

export function ParticleField({ count = 24, className }: { count?: number; className?: string }) {
  const [particles] = useState<Particle[]>(() => makeParticles(count));

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none absolute inset-0 overflow-hidden " + (className ?? "")
      }
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, -60],
            scale: [0.6, 1, 0.6],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
