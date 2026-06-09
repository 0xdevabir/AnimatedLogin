import type { DBShape, Session, User } from "./storage";
import { readDB, updateDB } from "./storage";
import { uid, sleep } from "./utils";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const OTP_TTL_MS = 1000 * 60 * 5;
const OTP_MAX_ATTEMPTS = 5;

function makeToken() {
  return `tok_${uid()}`;
}

function nowISO() {
  return new Date().toISOString();
}

function makeSession(userId: string): Session {
  return {
    userId,
    token: makeToken(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}) {
  await sleep(700);
  const email = input.email.toLowerCase().trim();
  const db = readDB();
  if (db.users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists");
  }
  const user: User = {
    id: uid("usr"),
    name: input.name.trim(),
    email,
    password: input.password,
    createdAt: nowISO(),
  };
  const session = makeSession(user.id);
  updateDB((d) => {
    d.users.push(user);
    d.session = session;
  });
  return { user, session };
}

export async function signIn(input: { email: string; password: string }) {
  await sleep(700);
  const email = input.email.toLowerCase().trim();
  const db = readDB();
  const user = db.users.find((u) => u.email === email);
  if (!user || user.password !== input.password) {
    throw new Error("Invalid email or password");
  }
  const session = makeSession(user.id);
  updateDB((d) => {
    d.session = session;
  });
  return { user, session };
}

export async function signOut() {
  await sleep(200);
  updateDB((d) => {
    d.session = null;
  });
}

export function currentUser(): User | null {
  const db = readDB();
  if (!db.session) return null;
  if (new Date(db.session.expiresAt) < new Date()) {
    updateDB((d) => {
      d.session = null;
    });
    return null;
  }
  return db.users.find((u) => u.id === db.session!.userId) ?? null;
}

export function allUsers(): User[] {
  return readDB().users;
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<User, "name" | "bio" | "avatar">>
) {
  await sleep(300);
  updateDB((d) => {
    const u = d.users.find((x) => x.id === userId);
    if (u) Object.assign(u, patch);
  });
}

export async function addUser(input: {
  name: string;
  email: string;
  role: string;
}) {
  await sleep(400);
  const email = input.email.toLowerCase().trim();
  const db = readDB();
  if (db.users.some((u) => u.email === email)) {
    throw new Error("Email already in use");
  }
  const user: User = {
    id: uid("usr"),
    name: input.name.trim(),
    email,
    password: "demo1234",
    createdAt: nowISO(),
    bio: input.role,
  };
  updateDB((d) => {
    d.users.push(user);
  });
  return user;
}

export async function removeUser(userId: string) {
  await sleep(300);
  updateDB((d) => {
    d.users = d.users.filter((u) => u.id !== userId);
    if (d.session?.userId === userId) d.session = null;
  });
}

export function requestOtp(email: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  updateDB((d) => {
    d.otp[email.toLowerCase()] = { code, expiresAt, attempts: 0 };
  });
  return code; // exposed for demo only
}

export async function verifyOtp(email: string, code: string) {
  await sleep(400);
  const key = email.toLowerCase();
  const db = readDB();
  const entry = db.otp[key];
  if (!entry) throw new Error("No code requested for this email");
  if (new Date(entry.expiresAt) < new Date()) {
    updateDB((d) => delete d.otp[key]);
    throw new Error("Code expired — request a new one");
  }
  if (entry.attempts >= OTP_MAX_ATTEMPTS) {
    throw new Error("Too many attempts — request a new code");
  }
  if (entry.code !== code) {
    updateDB((d) => {
      const e = d.otp[key];
      if (e) e.attempts += 1;
    });
    throw new Error("Incorrect code");
  }
  updateDB((d) => delete d.otp[key]);
  return true;
}

export function getPrefs() {
  return readDB().prefs;
}
export function setPrefs(patch: Partial<DBShape["prefs"]>) {
  updateDB((d) => {
    d.prefs = { ...d.prefs, ...patch };
  });
}
