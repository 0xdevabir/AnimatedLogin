"use client";

import { useDB } from "@/lib/store";
import { useEffect } from "react";

/**
 * Mounts a global subscription to the storage `db` event and
 * the browser's storage event, so cross-tab updates and direct
 * writes are picked up by zustand state automatically.
 */
export function useDBSync() {
  const set = useDB((s) => s.set);
  useEffect(() => {
    const onLocal = () => {
      // Force re-read by triggering a no-op mutator that mirrors state
      set((d) => {
        // no-op, but we still need a fresh read; simplest: return d
        return d;
      });
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "animlogin:v1") onLocal();
    };
    window.addEventListener("animlogin:db", onLocal as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("animlogin:db", onLocal as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [set]);
}
