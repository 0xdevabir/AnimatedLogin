"use client";

import { useEffect, useRef } from "react";
import { useDB } from "@/lib/store";
import { readDB, writeDB } from "@/lib/storage";
import { uid } from "@/lib/utils";

/**
 * Hydrates zustand from localStorage on mount and seeds demo
 * data on the very first visit. Idempotent.
 */
export function DBHydrator() {
  const hydrate = useDB((s) => s.hydrate);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const db = readDB();
    if (db.users.length === 0) {
      const now = new Date().toISOString();
      const seeded = [
        {
          id: uid("usr"),
          name: "Aurora Demo",
          email: "demo@aurora.app",
          password: "demo1234",
          bio: "Built-in demo account",
          createdAt: now,
        },
        {
          id: uid("usr"),
          name: "Ada Lovelace",
          email: "ada@aurora.app",
          password: "demo1234",
          bio: "Mathematician · Visionary",
          createdAt: now,
        },
        {
          id: uid("usr"),
          name: "Grace Hopper",
          email: "grace@aurora.app",
          password: "demo1234",
          bio: "Compiler pioneer",
          createdAt: now,
        },
      ];
      writeDB({ ...db, users: seeded });
    }
    hydrate();
  }, [hydrate]);
  return null;
}
