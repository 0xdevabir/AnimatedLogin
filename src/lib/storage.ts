export const STORAGE_KEY = "animlogin:v1";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  token: string;
  expiresAt: string;
};

export type Prefs = {
  theme: "light" | "dark" | "system";
  reduceMotion: boolean;
};

export type DBShape = {
  version: number;
  users: User[];
  session: Session | null;
  prefs: Prefs;
  otp: Record<string, { code: string; expiresAt: string; attempts: number }>;
};

const defaultDB: DBShape = {
  version: 1,
  users: [],
  session: null,
  prefs: { theme: "system", reduceMotion: false },
  otp: {},
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function readDB(): DBShape {
  if (!isBrowser()) return structuredClone(defaultDB);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultDB);
    const parsed = JSON.parse(raw) as DBShape;
    return { ...structuredClone(defaultDB), ...parsed };
  } catch {
    return structuredClone(defaultDB);
  }
}

export function writeDB(db: DBShape) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent("animlogin:db"));
  } catch {
    // ignore
  }
}

export function updateDB(mutator: (db: DBShape) => DBShape | void): DBShape {
  const cur = readDB();
  const next = mutator(cur) ?? cur;
  writeDB(next);
  return next;
}
