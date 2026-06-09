"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/store";
import { signOut } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { CountUp } from "@/components/motion/count-up";
import { ParticleField } from "@/components/motion/particle-field";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ClosingCurtain } from "@/components/motion/closing-curtain";

const COUNTDOWN_SECONDS = 5;

export default function SignoutPage() {
  const router = useRouter();
  const user = useDB((s) => s.user);
  const hydrated = useDB((s) => s.hydrated);
  const setSession = useDB((s) => s.setSession);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [stage, setStage] = useState<"confirm" | "leaving">("confirm");

  const performSignOut = useCallback(async () => {
    setStage("leaving");
    setSession(null);
    try {
      await signOut();
    } catch {
      // ignore — session already cleared
    }
    setTimeout(() => {
      toast.success("Signed out — see you soon");
      router.replace("/");
    }, 900);
  }, [router, setSession]);

  // Auto-redirect countdown
  useEffect(() => {
    if (stage !== "confirm") return;
    if (secondsLeft <= 0) {
      const id = setTimeout(() => {
        void performSignOut();
      }, 0);
      return () => clearTimeout(id);
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, stage, performSignOut]);

  // If we land here without a session, kick back to /
  useEffect(() => {
    if (hydrated && !user) router.replace("/");
  }, [hydrated, user, router]);

  const cancel = () => {
    toast.message("Stayed signed in", { description: "Your session is still active." });
    router.replace("/dashboard");
  };

  if (!hydrated || !user) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const pct = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100;

  return (
    <div className="relative px-6 sm:px-10 py-12 max-w-xl mx-auto">
      {stage === "leaving" && <ClosingCurtain />}

      <AnimatePresence mode="wait">
        {stage === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <SpotlightCard>
              <div className="relative overflow-hidden rounded-2xl">
                <ParticleField count={18} />

                <div className="relative p-8 sm:p-10 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className="mx-auto mb-5 inline-block"
                  >
                    <Avatar name={user.name} size={64} />
                  </motion.div>

                  <LetterReveal
                    text={`See you soon, ${user.name.split(" ")[0]}.`}
                    className="text-2xl sm:text-3xl font-semibold tracking-tight justify-center"
                    accentWords={[3]}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 text-sm text-muted-foreground"
                  >
                    You&apos;ll be signed out automatically in{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      <CountUp to={Math.max(secondsLeft, 0)} duration={0.4} />
                    </span>{" "}
                    seconds, or you can sign out right now.
                  </motion.p>

                  {/* Progress bar */}
                  <div className="mt-6 mx-auto max-w-xs h-1 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "linear" }}
                    />
                  </div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2"
                  >
                    <button
                      onClick={performSignOut}
                      className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-[var(--shadow-soft)] hover:bg-foreground/90 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out now
                    </button>
                    <button
                      onClick={cancel}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-5 py-2.5 text-sm font-medium hover:border-primary/40 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Stay signed in
                    </button>
                  </motion.div>
                </div>
              </div>
            </SpotlightCard>

            {/* Reassurance footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 grid gap-3 sm:grid-cols-2"
            >
              <Reassure
                icon={ShieldCheck}
                title="Local session"
                desc="Your account lives in this browser only. Signing out just clears the session token."
              />
              <Reassure
                icon={Clock}
                title="Come back anytime"
                desc="Your team, settings and stats will be exactly where you left them."
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="mt-6 text-center text-xs text-muted-foreground"
            >
              Want to be sure?{" "}
              <Link
                href="/dashboard/settings"
                className="text-foreground hover:text-primary underline underline-offset-4 decoration-border"
              >
                Manage preferences
              </Link>{" "}
              instead.
            </motion.p>
          </motion.div>
        )}

        {stage === "leaving" && (
          <motion.div
            key="leaving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[40vh] flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                className="mx-auto h-10 w-10 rounded-full border-2 border-muted border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-sm text-muted-foreground">Signing you out…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Reassure({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
