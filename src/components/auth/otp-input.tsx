"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type OTPInputProps = {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  length?: number;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
};

export function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  autoFocus,
  className,
  disabled,
  error,
}: OTPInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (i: number, ch: string) => {
    const arr = value.split("");
    arr[i] = ch;
    onChange(arr.join("").slice(0, length));
  };

  const handleChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(i, "");
      return;
    }
    setDigit(i, raw[raw.length - 1]);
    if (i < length - 1) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[i]) {
        setDigit(i, "");
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
        setDigit(i - 1, "");
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (data) {
      e.preventDefault();
      onChange(data.padEnd(value.length, " "));
      const last = Math.min(data.length, length) - 1;
      inputs.current[last]?.focus();
      if (data.length === length) onComplete?.(data);
    }
  };

  useEffect(() => {
    if (value.length === length) onComplete?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={cn("flex gap-2 sm:gap-3 justify-between", className)}>
      {Array.from({ length }).map((_, i) => {
        const ch = value[i] ?? "";
        return (
          <div
            key={i}
            className={cn(
              "relative h-12 w-10 sm:h-14 sm:w-12 rounded-xl border bg-card",
              "border-border focus-within:border-primary",
              "shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)]",
              error && "border-destructive focus-within:border-destructive"
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={ch || "empty"}
                initial={{ y: 14, opacity: 0, rotateX: -60 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -14, opacity: 0, rotateX: 60 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-semibold text-foreground"
                style={{ transformStyle: "preserve-3d", perspective: 600 }}
              >
                {ch}
              </motion.span>
            </AnimatePresence>
            <input
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              value={ch}
              disabled={disabled}
              onChange={handleChange(i)}
              onKeyDown={handleKey(i)}
              onPaste={handlePaste}
              className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-transparent outline-none"
              aria-label={`Digit ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
}
