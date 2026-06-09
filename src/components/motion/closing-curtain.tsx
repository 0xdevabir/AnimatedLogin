"use client";

import { AnimatePresence, motion } from "framer-motion";

const COLS = 6;

export function ClosingCurtain() {
  return (
    <AnimatePresence>
      <motion.div
        key="closing"
        aria-hidden
        className="fixed inset-0 z-[100] pointer-events-none grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: COLS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full bg-foreground"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.7,
              delay: i * 0.05,
              ease: [0.83, 0, 0.17, 1],
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
