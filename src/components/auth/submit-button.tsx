"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { AnimatedCheck } from "@/components/motion/animated-check";
import { Confetti } from "@/components/motion/confetti";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  status: Status;
  loadingText?: string;
  successText?: string;
  children: ReactNode;
  successConfetti?: boolean;
};

export function SubmitButton({
  status,
  loadingText = "Working…",
  successText = "Done",
  children,
  successConfetti,
  className,
  disabled,
  ...rest
}: SubmitButtonProps) {
  const [hover, setHover] = useState(false);
  const isWorking = status === "loading";
  const isSuccess = status === "success";

  return (
    <motion.button
      type="submit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileTap={{ scale: 0.985 }}
      disabled={disabled || isWorking}
      className={cn(
        "group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl",
        "text-sm font-semibold text-primary-foreground",
        "bg-[image:var(--gradient-brand)]",
        "shadow-[var(--shadow-lift)]",
        "disabled:opacity-90 disabled:cursor-progress",
        "transition-[transform,box-shadow] hover:shadow-[0_8px_40px_-12px_color-mix(in_oklch,var(--primary)_60%,transparent)]",
        className
      )}
      {...rest}
    >
      {/* liquid fill on loading */}
      <AnimatePresence>
        {isWorking && (
          <motion.span
            key="fill"
            className="absolute inset-0 bg-foreground/10"
            initial={{ x: "-110%" }}
            animate={{ x: "110%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
      {/* shimmer on hover */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity",
          hover && !isWorking && !isSuccess ? "opacity-100 shimmer" : "opacity-0"
        )}
        aria-hidden
      />

      <span className="relative flex items-center justify-center gap-2">
        <AnimatePresence mode="wait" initial={false}>
          {isWorking ? (
            <motion.span
              key="load"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText}
            </motion.span>
          ) : isSuccess ? (
            <motion.span
              key="ok"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <AnimatedCheck className="h-5 w-5" />
              {successText}
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {children}
              <motion.span
                aria-hidden
                className="inline-block"
                initial={{ x: 0 }}
                animate={{ x: hover ? 3 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                →
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {isSuccess && successConfetti && <Confetti count={28} />}
    </motion.button>
  );
}
