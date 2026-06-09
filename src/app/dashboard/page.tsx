"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Link from "next/link";
import { Activity, Sparkles, Users, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";
import { useDB } from "@/lib/store";
import { TiltCard } from "@/components/motion/tilt-card";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

const STATS = (count: number) => [
  { label: "Team members", value: count, icon: Users, accent: "oklch(0.72 0.22 280)" },
  { label: "Active sessions", value: 1, icon: Activity, accent: "oklch(0.72 0.18 200)" },
  { label: "Storage used", value: "0.4 KB", icon: Sparkles, accent: "oklch(0.7 0.2 330)" },
  { label: "Security score", value: "A+", icon: ShieldCheck, accent: "oklch(0.68 0.18 155)" },
];

export default function DashboardPage() {
  const user = useDB((s) => s.user);
  const allUsers = useDB((s) => s.db.users);
  const recent = useMemo(() => [...allUsers].slice(-4).reverse(), [allUsers]);
  const stats = STATS(allUsers.length);

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground"
          >
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight"
          >
            Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0]}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-muted-foreground"
          >
            Here&apos;s what&apos;s happening across your workspace today.
          </motion.p>
        </div>
        <Link
          href="/dashboard/users"
          className="group inline-flex items-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
        >
          Manage team
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </header>

      {/* Stat grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TiltCard className="rounded-2xl" intensity={6}>
              <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
                    style={{ background: s.accent }}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                  <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </section>

      {/* Recent members */}
      <section className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                transition={{ delay: 0.05 * i }}
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
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
        >
          <h2 className="font-semibold mb-3">Quick actions</h2>
          <div className="space-y-2">
            <Link
              href="/dashboard/users"
              className="group flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent transition-colors"
            >
              Invite a teammate
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent transition-colors"
            >
              Edit your profile
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="group flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent transition-colors"
            >
              Tune preferences
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="group flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent transition-colors"
            >
              Tune preferences
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
