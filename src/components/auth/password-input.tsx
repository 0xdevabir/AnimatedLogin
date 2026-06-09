"use client";

import { useMemo, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import { FormField } from "./form-field";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  showStrength?: boolean;
};

const CHECKS = [
  { test: (s: string) => s.length >= 8, label: "8+ characters" },
  { test: (s: string) => /[A-Z]/.test(s), label: "Uppercase" },
  { test: (s: string) => /[a-z]/.test(s), label: "Lowercase" },
  { test: (s: string) => /[0-9]/.test(s), label: "Number" },
  { test: (s: string) => /[^A-Za-z0-9]/.test(s), label: "Symbol" },
];

function score(s: string) {
  return CHECKS.reduce((acc, c) => acc + (c.test(s) ? 1 : 0), 0);
}

const STRENGTH_LABEL = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];

export function PasswordInput({
  label = "Password",
  error,
  showStrength,
  value,
  defaultValue,
  onChange,
  ...rest
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const v = (value ?? defaultValue ?? "") as string;
  const s = useMemo(() => score(v), [v]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <FormField
          type={show ? "text" : "password"}
          label={label}
          icon={<Lock className="h-4 w-4" />}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          error={error}
          autoComplete="current-password"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.span
            key={show ? "off" : "on"}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="block"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </motion.span>
        </button>
      </div>
      <AnimatePresence>
        {showStrength && v.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const active = i < s;
                return (
                  <motion.span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      active
                        ? s <= 2
                          ? "bg-destructive"
                          : s <= 3
                          ? "bg-warning"
                          : "bg-success"
                        : "bg-muted"
                    )}
                    initial={{ scaleX: 0.2, opacity: 0.4 }}
                    animate={{ scaleX: active ? 1 : 0.2, opacity: active ? 1 : 0.4 }}
                    transition={{ duration: 0.25 }}
                    style={{ transformOrigin: "left" }}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {CHECKS.map((c) => {
                const ok = c.test(v);
                return (
                  <span
                    key={c.label}
                    className={cn(
                      "flex items-center gap-1 text-[11px] transition-colors",
                      ok ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {c.label}
                  </span>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Strength: <span className="font-medium text-foreground">{STRENGTH_LABEL[s]}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
