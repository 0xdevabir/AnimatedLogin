"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotForm } from "./forgot-form";
import { AuthShell } from "./auth-shell";

type Mode = "login" | "signup" | "forgot";

const COPY: Record<
  Mode,
  { title: string; subtitle: string; side: "left" | "right" }
> = {
  login: {
    title: "Welcome back",
    subtitle: "Pick up exactly where you left off. Local-only, zero tracking.",
    side: "left",
  },
  signup: {
    title: "Create your account",
    subtitle: "It takes less than a minute — and your data never leaves your browser.",
    side: "right",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "We'll send a 6-digit code to your inbox to verify it's you.",
    side: "right",
  },
};

export function AuthOrchestrator() {
  const [mode, setMode] = useState<Mode>("login");
  const copy = COPY[mode];

  return (
    <AuthShell
      key={mode}
      side={copy.side}
      title={copy.title}
      subtitle={copy.subtitle}
      footer={
        <p className="text-center text-[11px] text-muted-foreground">
          Protected by motion. Powered by local storage.
        </p>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {mode === "login" && <LoginForm onSwitch={setMode} />}
          {mode === "signup" && <SignupForm onSwitch={setMode} />}
          {mode === "forgot" && <ForgotForm onSwitch={setMode} />}
        </motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}
