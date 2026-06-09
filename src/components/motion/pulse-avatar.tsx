"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PulseAvatarProps = {
  name: string;
  size?: number;
  className?: string;
};

export function PulseAvatar({ name, size = 88, className }: PulseAvatarProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border border-primary/40"
        animate={{ scale: [1, 1.6, 1.8], opacity: [0.5, 0.15, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border border-primary/30"
        animate={{ scale: [1, 1.4, 1.6], opacity: [0.4, 0.1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
        className="rounded-full border-2 border-background shadow-[var(--shadow-lift)]"
      >
        <Avatar name={name} size={size} />
      </motion.div>
    </div>
  );
}
