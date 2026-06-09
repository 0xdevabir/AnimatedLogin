"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/store";
import { addUser, removeUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import { FormField } from "@/components/auth/form-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { newUserSchema, type NewUserInput } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

export default function UsersPage() {
  const users = useDB((s) => s.db.users);
  const me = useDB((s) => s.user);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const onAdd = async (data: NewUserInput) => {
    setBusy(true);
    try {
      await addUser(data);
      toast.success(`Added ${data.name}`);
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add user");
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async (id: string, name: string) => {
    if (id === me?.id) {
      toast.error("You can't remove yourself");
      return;
    }
    try {
      await removeUser(id);
      toast.success(`Removed ${name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">People</h1>
          <p className="mt-1 text-muted-foreground">
            {users.length} {users.length === 1 ? "person" : "people"} in your workspace.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 self-start rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] hover:shadow-[0_8px_40px_-12px_color-mix(in_oklch,var(--primary)_60%,transparent)] transition-shadow"
        >
          <UserPlus className="h-4 w-4" />
          Invite member
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </header>

      <motion.ul
        layout
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {users.map((u, i) => (
            <motion.li
              key={u.id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              transition={{ delay: i * 0.03 }}
              className="group relative rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar name={u.name} size={48} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <button
                  onClick={() => onRemove(u.id, u.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Remove ${u.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Joined {formatDate(u.createdAt)} · {u.bio || "Member"}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* Add dialog */}
      <AnimatePresence>
        {open && (
          <AddUserDialog
            onClose={() => setOpen(false)}
            onSubmit={onAdd}
            busy={busy}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddUserDialog({
  onClose,
  onSubmit,
  busy,
}: {
  onClose: () => void;
  onSubmit: (d: NewUserInput) => Promise<void>;
  busy: boolean;
}) {
  const [form, setForm] = useState<NewUserInput>({
    name: "",
    email: "",
    role: "Viewer",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewUserInput, string>>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = newUserSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Partial<Record<keyof NewUserInput, string>> = {};
      for (const issue of parsed.error.issues) {
        fe[issue.path[0] as keyof NewUserInput] = issue.message;
      }
      setErrors(fe);
      return;
    }
    await onSubmit(parsed.data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Invite a teammate</h2>
          <p className="text-sm text-muted-foreground">They&apos;ll be added instantly to your local workspace.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <FormField
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
            autoComplete="off"
          />
          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
            autoComplete="off"
          />
          <RoleSelect
            value={form.role}
            onChange={(v) => setForm((f) => ({ ...f, role: v as NewUserInput["role"] }))}
          />
          <SubmitButton status={busy ? "loading" : "idle"} loadingText="Adding…">
            <Plus className="h-4 w-4" />
            Add to workspace
          </SubmitButton>
        </form>
      </motion.div>
    </motion.div>
  );
}

function RoleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const roles = ["Admin", "Editor", "Viewer"];
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground/80">Role</p>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => {
          const active = value === r;
          return (
            <button
              type="button"
              key={r}
              onClick={() => onChange(r)}
              className="relative rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40 transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="role-pill"
                  className="absolute inset-0 rounded-xl bg-accent border-primary/40"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span className="relative">{r}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
