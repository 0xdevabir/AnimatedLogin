"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, AtSign, Save, Camera } from "lucide-react";
import { useDB } from "@/lib/store";
import { updateProfile } from "@/lib/auth";
import { FormField } from "@/components/auth/form-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { Avatar } from "@/components/ui/avatar";
import { profileSchema, type ProfileInput } from "@/lib/validation";

export default function ProfilePage() {
  const user = useDB((s) => s.user);
  const setUser = useDB((s) => s.setUser);
  const [form, setForm] = useState<ProfileInput>({ name: user?.name ?? "", bio: user?.bio ?? "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [err, setErr] = useState<Partial<Record<keyof ProfileInput, string>>>({});

  if (!user) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Partial<Record<keyof ProfileInput, string>> = {};
      for (const i of parsed.error.issues) {
        fe[i.path[0] as keyof ProfileInput] = i.message;
      }
      setErr(fe);
      return;
    }
    setStatus("loading");
    try {
      await updateProfile(user.id, parsed.data);
      setUser(parsed.data);
      setStatus("success");
      toast.success("Profile updated");
      setTimeout(() => setStatus("idle"), 1200);
    } catch (e) {
      setStatus("idle");
      toast.error(e instanceof Error ? e.message : "Failed to save");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-2xl">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update how you appear across the workspace.
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
      >
        <div className="flex items-center gap-5 pb-6 border-b border-border">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Avatar name={form.name || user.name} size={72} />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shadow"
              aria-label="Change avatar"
              onClick={() => toast.message("Avatars coming soon")}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </motion.div>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="pt-6 space-y-4">
          <FormField
            label="Display name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            icon={<User className="h-4 w-4" />}
            error={err.name}
            success={!err.name && form.name.length > 1}
          />
          <FormField
            label="Email"
            value={user.email}
            icon={<AtSign className="h-4 w-4" />}
            readOnly
            hint="Email is locked to your account"
          />
          <FormField
            label="Bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            error={err.bio}
            hint="Up to 160 characters"
            maxLength={160}
          />
          <SubmitButton status={status} successText="Saved" loadingText="Saving…">
            <Save className="h-4 w-4" />
            Save changes
          </SubmitButton>
        </form>
      </motion.div>
    </div>
  );
}
