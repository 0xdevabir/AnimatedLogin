"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, Zap } from "lucide-react";
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

const FEATURES = [
  { icon: Sparkles, title: "Cinematic motion", desc: "Layout-morph panels and liquid micro-interactions" },
  { icon: Shield, title: "Local & private", desc: "All accounts live in your browser's local storage" },
  { icon: Zap, title: "Snappy & modern", desc: "Built on Next.js 16, React 19 and Tailwind 4" },
];

export function AuthShell({ side, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-svh w-full grid lg:grid-cols-2">
      {/* Brand panel */}
      <motion.aside
        initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative hidden lg:flex flex-col justify-between p-12 overflow-hidden",
          "bg-card/40 backdrop-blur-2xl border-r border-border"
        )}
      >
        <FloatingOrbs />
        <header className="relative z-10 flex items-center gap-2">
          <LogoMark />
          <span className="font-semibold text-lg">Aurora</span>
        </header>

        <TiltCard className="relative z-10 max-w-md">
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              <span className="text-gradient">Motion</span> that tells a story.
            </h2>
            <p className="text-muted-foreground text-base">
              Every detail is choreographed — from the way fields draw their underline to
              the submit button&apos;s liquid morph. Built to be felt, not just seen.
            </p>
            <ul className="space-y-3 pt-2">
              {FEATURES.map((f) => (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-primary">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </TiltCard>

        <p className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aurora Labs · Crafted with motion
        </p>
      </motion.aside>

      {/* Form panel */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center p-6 sm:p-10"
      >
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <LogoMark />
            <span className="font-semibold text-lg">Aurora</span>
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
              className="text-3xl sm:text-4xl font-semibold tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              key={subtitle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-sm text-muted-foreground"
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
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-lift)]">
      <motion.span
        aria-hidden
        className="absolute inset-1 rounded-lg bg-background/30"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <span className="relative font-bold text-primary-foreground">A</span>
    </span>
  );
}

function FloatingOrbs() {
  return (
    <>
      <motion.div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full"
        style={{
          background: "oklch(0.78 0.18 280 / 0.35)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full"
        style={{
          background: "oklch(0.72 0.2 200 / 0.32)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "oklch(0.78 0.18 330 / 0.25)",
          filter: "blur(70px)",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
