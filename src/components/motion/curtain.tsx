"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLS = 6;

export function CurtainIntro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          aria-hidden
          className="fixed inset-0 z-[100] pointer-events-none grid"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {Array.from({ length: COLS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full bg-foreground"
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.05,
                ease: [0.83, 0, 0.17, 1],
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
