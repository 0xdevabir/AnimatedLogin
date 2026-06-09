"use client";

import { motion } from "framer-motion";
import { Database, Download, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { STORAGE_KEY } from "@/lib/storage";
import { useMounted } from "@/hooks/use-mounted";

export default function SettingsPage() {
  const prefs = useDB((s) => s.db.prefs);
  const setPrefs = useDB((s) => s.setPrefs);
  const set = useDB((s) => s.set);
  const mounted = useMounted();

  const exportData = () => {
    const data = JSON.stringify(useDB.getState().db, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurora-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported your data");
  };

  const wipe = () => {
    if (!confirm("This will remove all users and your session. Continue?")) return;
    set((d) => {
      d.users = [];
      d.session = null;
      d.otp = {};
    });
    toast.success("Workspace cleared");
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Tune how Aurora looks and behaves. Everything stays in your browser.
        </p>
      </header>

      {/* Appearance */}
      <Section icon={Sparkles} title="Appearance" desc="Pick a theme or follow your system.">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Theme</span>
          {mounted ? <ThemeToggle /> : <div className="h-10 w-28" />}
        </div>
        <Row
          label="Reduce motion"
          desc="Minimize animations for a calmer experience."
        >
          <Switch
            checked={prefs.reduceMotion}
            onCheckedChange={(v) => {
              setPrefs({ reduceMotion: v });
              document.documentElement.classList.toggle("reduced-motion", v);
            }}
          />
        </Row>
      </Section>

      {/* Data */}
      <Section icon={Database} title="Data" desc="Your data lives in localStorage. Export it or wipe it any time.">
        <Row label="Storage key" desc="Identifies this workspace in your browser.">
          <code className="rounded-md bg-muted px-2 py-1 text-xs">{STORAGE_KEY}</code>
        </Row>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40 hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <button
            onClick={wipe}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Wipe workspace
          </button>
        </div>
      </Section>

      <p className="text-xs text-muted-foreground">
        Aurora is a client-side demo. No data ever leaves your device.
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md"
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.section>
  );
}

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}
