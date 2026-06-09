"use client";

import { motion } from "framer-motion";

export function AnimatedCheck({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      initial="hidden"
      animate="show"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.circle
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={2.5}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          show: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M7 12.5l3 3 7-7"
        variants={{
          hidden: { pathLength: 0 },
          show: { pathLength: 1 },
        }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
      />
    </motion.svg>
  );
}
