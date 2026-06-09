"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ConfettiProps = {
  count?: number;
  className?: string;
  colors?: string[];
};

const DEFAULTS = [
  "oklch(0.72 0.22 280)",
  "oklch(0.7 0.2 330)",
  "oklch(0.72 0.18 200)",
  "oklch(0.78 0.16 75)",
  "oklch(0.68 0.18 155)",
];

type Piece = {
  id: number;
  x: number;
  y: number;
  r: number;
  c: string;
  s: number;
  d: number;
};

function makePieces(count: number, colors: string[]): Piece[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 600,
    y: -Math.random() * 200 - 80,
    r: Math.random() * 360,
    c: colors[i % colors.length],
    s: 0.6 + Math.random() * 0.8,
    d: 0.6 + Math.random() * 0.6,
  }));
}

export function Confetti({ count = 40, className, colors = DEFAULTS }: ConfettiProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    setPieces(makePieces(count, colors));
  }, [count, colors]);
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-visible " + (className ?? "")}>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: 600, opacity: 0, rotate: p.r }}
          transition={{ duration: p.d + 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 8 * p.s,
            height: 12 * p.s,
            background: p.c,
            borderRadius: 1.5,
          }}
        />
      ))}
    </div>
  );
}
