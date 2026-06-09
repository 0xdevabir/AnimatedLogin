"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserPlus, LogIn, KeyRound, FileText, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Event = {
  id: string;
  actor: string;
  actorEmail: string;
  action: string;
  target?: string;
  icon: LucideIcon;
  minutesAgo: number;
  type: "auth" | "people" | "system";
};

const ICONS: Record<Event["type"], LucideIcon> = {
  auth: LogIn,
  people: UserPlus,
  system: Check,
};

const SAMPLE: Omit<Event, "id" | "minutesAgo">[] = [
  { actor: "Ada Lovelace", actorEmail: "ada@aurora.app", action: "signed in", icon: LogIn, type: "auth" },
  { actor: "Grace Hopper", actorEmail: "grace@aurora.app", action: "joined the workspace", icon: UserPlus, type: "people" },
  { actor: "System", actorEmail: "system@aurora.app", action: "rotated API keys", icon: KeyRound, type: "system" },
  { actor: "Ada Lovelace", actorEmail: "ada@aurora.app", action: "updated profile", target: "Display name", icon: FileText, type: "people" },
];

function relTime(min: number) {
  if (min < 1) return "just now";
  if (min < 60) return `${Math.round(min)}m ago`;
  if (min < 60 * 24) return `${Math.round(min / 60)}h ago`;
  return `${Math.round(min / (60 * 24))}d ago`;
}

export function ActivityFeed() {
  const [events, setEvents] = useState<Event[]>(() =>
    SAMPLE.map((s, i) => ({
      ...s,
      id: `e${i}`,
      minutesAgo: (i + 1) * 13 + 2,
    })).sort((a, b) => a.minutesAgo - b.minutesAgo)
  );

  useEffect(() => {
    // simulate one new event every 9s
    const i = setInterval(() => {
      const next = SAMPLE[Math.floor(Math.random() * SAMPLE.length)];
      setEvents((prev) => {
        const newEvent: Event = {
          ...next,
          id: `e${Date.now()}`,
          minutesAgo: 0,
        };
        return [newEvent, ...prev].slice(0, 6);
      });
    }, 9000);
    return () => clearInterval(i);
  }, []);

  return (
    <ul className="space-y-2.5">
      <AnimatePresence initial={false}>
        {events.map((e) => {
          const Icon = ICONS[e.type];
          return (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 hover:border-border hover:bg-background/40 transition-colors"
            >
              <div className="relative">
                <Avatar name={e.actor} size={32} />
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-card",
                    e.type === "auth" && "bg-primary text-primary-foreground",
                    e.type === "people" && "bg-warning text-primary-foreground",
                    e.type === "system" && "bg-muted-foreground text-background"
                  )}
                >
                  <Icon className="h-2.5 w-2.5" />
                </span>
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="truncate">
                  <span className="font-medium">{e.actor}</span>{" "}
                  <span className="text-muted-foreground">{e.action}</span>
                  {e.target && (
                    <>
                      {" "}
                      <span className="text-foreground">{e.target}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{relTime(e.minutesAgo)}</p>
              </div>
              {e.minutesAgo === 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-primary"
                >
                  New
                </motion.span>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
