"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, KeyRound, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  side: "left" | "right";
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: KeyRound,
    title: "Local-first",
    desc: "Accounts and sessions live in your browser. Nothing is uploaded.",
  },
  {
    icon: ShieldCheck,
    title: "Validated end-to-end",
    desc: "Zod schemas guard every field with live, animated feedback.",
  },
  {
    icon: Zap,
    title: "Built on the latest stack",
    desc: "Next.js 16, React 19, Tailwind 4 and Framer Motion 12.",
  },
];

export function AuthShell({ side, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-svh w-full grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <motion.aside
        initial={{ opacity: 0, x: side === "left" ? -16 : 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative hidden lg:flex flex-col justify-between p-12 overflow-hidden",
          "bg-card/40 backdrop-blur-2xl border-r border-border"
        )}
      >
        <SingleGlow />

        <header className="relative z-10 flex items-center gap-2.5">
          <LogoMark />
          <span className="font-semibold text-base tracking-tight">Aurora</span>
        </header>

        <TiltCard className="relative z-10 max-w-md" intensity={5}>
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Choreographed with motion
            </div>
            <h2 className="text-[2.5rem] font-semibold leading-[1.1] tracking-tight">
              Sign in without the noise.
            </h2>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              Every interaction is animated with intent — floating labels that
              glide, underlines that draw from the center, and a submit button
              that morphs through the entire flow.
            </p>
            <ul className="space-y-3 pt-2">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </TiltCard>

        <p className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aurora · Crafted with restraint
        </p>
      </motion.aside>

      {/* Form panel */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center p-6 sm:p-10"
      >
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <LogoMark />
            <span className="font-semibold text-base tracking-tight">Aurora</span>
          </div>
          <motion.div
            layout
            className="space-y-2"
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-[1.875rem] font-semibold tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              key={subtitle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            layout
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="mt-8"
          >
            {children}
          </motion.div>

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </motion.section>
    </div>
  );
}

function LogoMark() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-[var(--shadow-soft)]">
      <span className="font-semibold tracking-tight">A</span>
      <span
        aria-hidden
        className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background"
      />
    </span>
  );
}

function SingleGlow() {
  return (
    <motion.div
      className="absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 60%)",
        filter: "blur(60px)",
      }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
