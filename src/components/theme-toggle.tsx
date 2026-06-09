"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const OPTS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  if (!mounted) return null;
  const current = (theme as "light" | "dark" | "system") ?? "system";

  if (compact) {
    return (
      <button
        onClick={() =>
          setTheme(current === "dark" ? "light" : current === "light" ? "system" : "dark")
        }
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
        aria-label={`Theme: ${current}. Click to change.`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {current === "dark" && (
            <motion.span
              key="d"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-3.5 w-3.5" />
            </motion.span>
          )}
          {current === "light" && (
            <motion.span
              key="l"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-3.5 w-3.5" />
            </motion.span>
          )}
          {current === "system" && (
            <motion.span
              key="s"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Monitor className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card/60 p-1">
      {OPTS.map((o) => {
        const active = current === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            aria-label={o.label}
            className={cn(
              "relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors",
              active && "text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-lg bg-accent border border-border"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            )}
            <o.icon className="relative h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
