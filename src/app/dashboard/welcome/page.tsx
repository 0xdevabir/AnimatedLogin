"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Users,
  UserCircle2,
  Settings,
  Sparkles,
  ShieldCheck,
  Zap,
  Github,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { useDB } from "@/lib/store";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { CountUp } from "@/components/motion/count-up";
import { ParticleField } from "@/components/motion/particle-field";
import { PulseAvatar } from "@/components/motion/pulse-avatar";
import { TourCard } from "@/components/dashboard/tour-card";
import { WelcomeBurst } from "@/components/dashboard/welcome-burst";
import { TiltCard } from "@/components/motion/tilt-card";
import { SpotlightCard } from "@/components/motion/spotlight-card";

function timeOfDay(date: Date) {
  const h = date.getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const TOUR: { icon: LucideIcon; title: string; desc: string; href: string; cta: string }[] = [
  {
    icon: Users,
    title: "Bring your team",
    desc: "Invite teammates and manage who can do what. Everything stays in your browser.",
    href: "/dashboard/users",
    cta: "Open People",
  },
  {
    icon: UserCircle2,
    title: "Make it yours",
    desc: "Add a name, a bio, and an avatar so the rest of the workspace knows who's who.",
    href: "/dashboard/profile",
    cta: "Edit profile",
  },
  {
    icon: Settings,
    title: "Tune the experience",
    desc: "Switch themes, reduce motion, export your data, or wipe the workspace clean.",
    href: "/dashboard/settings",
    cta: "Preferences",
  },
];

export default function WelcomePage() {
  const user = useDB((s) => s.user);
  const users = useDB((s) => s.db.users);

  const [now] = useState(() => new Date());
  const teamCount = users.length;

  const daysActive = useMemo(() => {
    if (!user) return 1;
    const created = new Date(user.createdAt).getTime();
    return Math.max(1, Math.floor((now.getTime() - created) / (1000 * 60 * 60 * 24)) + 1);
  }, [user, now]);

  return (
    <div className="relative px-6 sm:px-10 pb-16 pt-10 sm:pt-16 max-w-5xl mx-auto">
      <WelcomeBurst />

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 sm:px-12 py-14 sm:py-20 text-center backdrop-blur-md">
        <ParticleField count={32} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 16%, transparent) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <PulseAvatar name={user?.name ?? "You"} size={88} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span>You&apos;re in</span>
          </motion.div>

          <LetterReveal
            text={`${timeOfDay(now)}, ${user?.name?.split(" ")[0] ?? "friend"}.`}
            className="text-4xl sm:text-6xl font-semibold tracking-tight justify-center"
            accentWords={[2]}
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-4 max-w-md text-muted-foreground"
          >
            Welcome to Aurora. Your workspace is ready — here&apos;s a quick tour of
            what you can do next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90 transition-colors"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-5 py-2.5 text-sm font-medium hover:border-primary/40 transition-colors"
            >
              Invite teammates
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        <StatTile
          label="Days with Aurora"
          value={daysActive}
          delay={0.85}
        />
        <StatTile label="People" value={teamCount} delay={0.95} />
        <StatTile label="Motion demos" value={12} delay={1.05} />
      </section>

      {/* TOUR */}
      <section className="mt-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-6 flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Where to next
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
              Three quick wins to get started
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TOUR.map((t, i) => (
            <TourCard key={t.title} index={i} {...t} />
          ))}
        </motion.div>
      </section>

      {/* HIGHLIGHT BAND */}
      <section className="mt-14">
        <TiltCard intensity={4} glow={false}>
          <SpotlightCard>
            <div className="grid gap-6 p-6 sm:p-8 sm:grid-cols-[1.2fr_1fr] sm:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Local-first by design
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Your data never leaves this browser.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Accounts, sessions and preferences live in localStorage. You can
                  export the whole thing as JSON, or wipe the workspace in one
                  click from settings.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Pill icon={Zap} label="Stack" value="Next 16 · React 19" />
                <Pill icon={ShieldCheck} label="Storage" value="localStorage" />
                <Pill icon={Sparkles} label="Motion" value="Framer 12" />
                <Pill icon={Sparkles} label="Theme" value="Graphite + Emerald" />
              </div>
            </div>
          </SpotlightCard>
        </TiltCard>
      </section>

      {/* FOOTER CTA */}
      <section className="mt-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-border"
          >
            Skip the tour, take me to the dashboard →
          </Link>
        </motion.div>

        <div className="mt-10 flex items-center justify-center gap-3 text-muted-foreground">
          <a
            href="https://github.com/0xdevabir/AnimatedLogin"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/40 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/40 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard>
        <div className="p-4 sm:p-5 text-center">
          <p className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums">
            <CountUp to={value} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function Pill({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground/80">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
