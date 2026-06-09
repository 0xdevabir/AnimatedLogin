"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
  success?: boolean;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, icon, hint, success, className, onFocus, onBlur, value, defaultValue, id, ...rest },
  ref
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [focused, setFocused] = useState(false);
  const hasValue = (value ?? defaultValue ?? "") !== "" ? true : false;
  const float = focused || hasValue;

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-card transition-colors",
          "border-border hover:border-muted-foreground/40",
          focused && "border-primary ring-2 ring-primary/20",
          error && "border-destructive ring-2 ring-destructive/20",
          success && !error && "border-success/70"
        )}
      >
        {icon && (
          <span
            className={cn(
              "pl-3 pr-2 text-muted-foreground transition-colors",
              focused && "text-primary"
            )}
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="peer w-full bg-transparent px-3 pt-5 pb-2 text-sm text-foreground outline-none placeholder-transparent"
          placeholder={label}
          {...rest}
        />
        <motion.label
          htmlFor={inputId}
          initial={false}
          animate={{
            y: float ? -6 : 0,
            scale: float ? 0.78 : 1,
            color: focused ? "var(--primary)" : error ? "var(--destructive)" : "var(--muted-foreground)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className={cn(
            "pointer-events-none absolute origin-left",
            icon ? "left-10" : "left-3",
            "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </motion.label>
        {/* Animated underline */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] origin-center rounded-full"
          style={{ background: "var(--primary)" }}
          initial={false}
          animate={{ width: focused ? "100%" : "0%", x: "-50%" }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
        />
        {success && !error && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mr-3 text-success"
            aria-hidden
          >
            <Check className="h-4 w-4" />
          </motion.span>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-muted-foreground"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
});
