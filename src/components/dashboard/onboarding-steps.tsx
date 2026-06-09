"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Step = { id: string; label: string; done: boolean };

type OnboardingStepsProps = {
  steps: Step[];
};

export function OnboardingSteps({ steps }: OnboardingStepsProps) {
  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium">Get set up</p>
          <p className="text-xs text-muted-foreground">
            {completed} of {steps.length} complete
          </p>
        </div>
        <motion.span
          key={pct}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-semibold tabular-nums tracking-tight"
        >
          {pct}%
        </motion.span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
      <ul className="mt-4 space-y-2.5">
        {steps.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center gap-2.5 text-sm"
          >
            <span
              className={
                s.done
                  ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  : "inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
              }
            >
              {s.done ? (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </motion.span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              )}
            </span>
            <span
              className={
                s.done ? "text-muted-foreground line-through" : "text-foreground"
              }
            >
              {s.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
