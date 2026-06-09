"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";

const container: Variants = {
  hidden: {},
  show: (i: number = 0) => ({
    transition: { staggerChildren: 0.022, delayChildren: 0.05 + i * 0.02 },
  }),
};

const child: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type LetterRevealProps = {
  text: string;
  className?: string;
  delayIndex?: number;
  accentWords?: number[];
};

export function LetterReveal({
  text,
  className,
  delayIndex = 0,
  accentWords,
}: LetterRevealProps) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  let wordIdx = 0;
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      custom={delayIndex}
      className={className}
      aria-label={text}
    >
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) {
          return <span key={i}>{w}</span>;
        }
        const isAccent = accentWords?.includes(wordIdx) ?? false;
        wordIdx++;
        return (
          <span
            key={i}
            className="inline-block whitespace-nowrap"
            aria-hidden
          >
            {w.split("").map((ch, j) => (
              <motion.span
                key={j}
                variants={child}
                className={
                  isAccent
                    ? "inline-block bg-[image:var(--gradient-brand)] bg-clip-text text-transparent"
                    : "inline-block"
                }
              >
                {ch}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.div>
  );
}
