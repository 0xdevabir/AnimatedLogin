"use client";

import { create } from "zustand";
import { readDB, writeDB, type DBShape, type User, type Prefs, type Session } from "@/lib/storage";

type State = {
  db: DBShape;
  user: User | null;
  hydrated: boolean;
  hydrate: () => void;
  set: (mutator: (db: DBShape) => DBShape | void) => void;
  setUser: (patch: Partial<User>) => void;
  setPrefs: (patch: Partial<Prefs>) => void;
  setSession: (s: Session | null) => void;
};

const empty: DBShape = {
  version: 1,
  users: [],
  session: null,
  prefs: { theme: "system", reduceMotion: false },
  otp: {},
};

export const useDB = create<State>((set, get) => ({
  db: empty,
  user: null,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const db = readDB();
    const user = db.session
      ? db.users.find((u) => u.id === db.session!.userId) ?? null
      : null;
    set({ db, user, hydrated: true });
  },
  set: (mutator) => {
    const next = mutator(get().db) ?? get().db;
    writeDB(next);
    const user = next.session
      ? next.users.find((u) => u.id === next.session!.userId) ?? null
      : null;
    set({ db: next, user });
  },
  setUser: (patch) => {
    get().set((d) => {
      if (!d.session) return;
      const u = d.users.find((x) => x.id === d.session!.userId);
      if (u) Object.assign(u, patch);
    });
  },
  setPrefs: (patch) => {
    get().set((d) => {
      d.prefs = { ...d.prefs, ...patch };
    });
  },
  setSession: (s) => {
    get().set((d) => {
      d.session = s;
    });
  },
}));
