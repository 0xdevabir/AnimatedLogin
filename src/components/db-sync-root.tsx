"use client";

import { useDBSync } from "@/hooks/use-db-sync";

export function DBSyncRoot() {
  useDBSync();
  return null;
}
