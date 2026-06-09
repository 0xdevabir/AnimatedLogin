"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, Sparkles, Users, ShieldCheck, ArrowUpRight, Clock } from "lucide-react";
import { useDB } from "@/lib/store";
import { TiltCard } from "@/components/motion/tilt-card";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { CountUp } from "@/components/motion/count-up";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ParticleField } from "@/components/motion/particle-field";
import { Avatar } from "@/components/ui/avatar";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { OnboardingSteps } from "@/components/dashboard/onboarding-steps";
import { WelcomeBurst } from "@/components/dashboard/welcome-burst";
import { formatDate } from "@/lib/utils";

const STATS = (count: number, sessions: number, daysActive: number) => [
  { label: "Team members", value: count, icon: Users },
  { label: "Active sessions", value: sessions, icon: Activity },
  { label: "Days active", value: daysActive, icon: Clock },
  { label: "Security score", value: "A+", icon: ShieldCheck, string: true },
];

function timeOfDayGreeting(date: Date) {
  const h = date.getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const user = useDB((s) => s.user);
  const allUsers = useDB((s) => s.db.users);
  const recent = useMemo(() => [...allUsers].slice(-4).reverse(), [allUsers]);

  const [now] = useState(() => new Date());
  const nowMs = now.getTime();
  const daysActive = useMemo(() => {
    if (!user) return 1;
    const created = new Date(user.createdAt).getTime();
    return Math.max(1, Math.floor((nowMs - created) / (1000 * 60 * 60 * 24)) + 1);
  }, [user, nowMs]);

  const sessions = 1;
  const stats = STATS(allUsers.length, sessions, daysActive);

  const onboarding = [
    { id: "profile", label: "Complete your profile", done: !!user?.bio },
    { id: "team", label: "Invite your first teammate", done: allUsers.length > 1 },
    { id: "prefs", label: "Tune your preferences", done: false },
    { id: "explore", label: "Explore motion features", done: true },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <WelcomeBurst />
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 sm:p-12 backdrop-blur-md">
        <ParticleField count={28} className="opacity-60" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Live · {now.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </motion.div>
            <LetterReveal
              text={`${timeOfDayGreeting(now)}, ${user?.name?.split(" ")[0] ?? "friend"}.`}
              className="text-4xl sm:text-5xl font-semibold tracking-tight"
              accentWords={[2]}
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 max-w-md text-muted-foreground"
            >
              You&apos;re on day{" "}
              <span className="font-semibold text-foreground tabular-nums">
                <CountUp to={daysActive} />
              </span>{" "}
              with Aurora. {allUsers.length} {allUsers.length === 1 ? "person" : "people"} in
              your workspace — let&apos;s make today count.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              <Link
                href="/dashboard/users"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Invite a teammate
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm font-medium hover:border-primary/40 transition-colors"
              >
                Edit profile
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 22 }}
            className="relative h-fit"
          >
            <TiltCard intensity={8} glow={false}>
              <SpotlightCard className="w-full lg:w-72">
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Streak
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums">
                    <CountUp to={daysActive * 3 + 12} />
                    <span className="text-base text-muted-foreground ml-1">pts</span>
                  </p>
                  <div className="mt-4 flex items-end gap-1.5 h-16">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const h = 30 + Math.abs(Math.sin(i * 0.7)) * 70;
                      return (
                        <motion.span
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            delay: 0.7 + i * 0.04,
                            type: "spring",
                            stiffness: 220,
                            damping: 16,
                          }}
                          style={{ height: `${h}%`, transformOrigin: "bottom" }}
                          className={
                            i === 13
                              ? "flex-1 rounded-sm bg-primary"
                              : "flex-1 rounded-sm bg-muted-foreground/20"
                          }
                        />
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Last 14 days · keep it going
                  </p>
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <TiltCard className="rounded-2xl" intensity={5} glow={false}>
              <SpotlightCard className="rounded-2xl">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80">
                      <s.icon className="h-4 w-4" />
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
                    {"string" in s && s.string ? (
                      s.value
                    ) : (
                      <CountUp to={s.value as number} />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        ))}
      </section>

      {/* ACTIVITY + ONBOARDING + RECENT */}
      <section className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Activity</h2>
              <p className="text-xs text-muted-foreground">
                What just happened in your workspace
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2.5 py-1 text-xs text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Live
            </span>
          </div>
          <ActivityFeed />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
        >
          <OnboardingSteps steps={onboarding} />
        </motion.div>
      </section>

      {/* RECENT MEMBERS + QUICK ACTIONS */}
      <section className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent members</h2>
            <Link
              href="/dashboard/users"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((u, i) => (
              <motion.li
                key={u.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.6 }}
                className="flex items-center gap-3 py-3"
              >
                <Avatar name={u.name} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
        >
          <h2 className="font-semibold mb-3">Quick actions</h2>
          <div className="space-y-2">
            <QuickLink href="/dashboard/users" label="Invite a teammate" />
            <QuickLink href="/dashboard/profile" label="Edit your profile" />
            <QuickLink href="/dashboard/settings" label="Tune preferences" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent transition-colors"
    >
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
