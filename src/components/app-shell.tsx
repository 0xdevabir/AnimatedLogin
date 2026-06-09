"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { Home, Users, Settings, LogOut, Menu, X, ShieldCheck, Sparkles } from "lucide-react";
import { useDB } from "@/lib/store";
import { signOut } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageTransition } from "@/components/motion/page-transition";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { href: "/dashboard/welcome", label: "Welcome", icon: Sparkles },
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/users", label: "People", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useDB((s) => s.user);
  const hydrated = useDB((s) => s.hydrated);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) router.replace("/");
  }, [hydrated, user, router]);

  const onSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
  };

  if (!hydrated) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-svh flex flex-col lg:flex-row">
      {/* Mobile topbar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground font-semibold text-background shadow-[var(--shadow-soft)]">
            A
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background"
            />
          </span>
          <span className="font-semibold">Aurora</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "m"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(open || typeof window !== "undefined") && (
          <motion.aside
            key="aside"
            initial={{ x: -300, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 220, damping: 26 },
            }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "lg:sticky lg:top-0 lg:h-svh z-40 lg:z-auto",
              "w-72 lg:w-64 shrink-0 border-r border-border bg-card/40 backdrop-blur-2xl",
              "fixed inset-y-0 left-0 lg:relative lg:translate-x-0",
              !open && "hidden lg:flex lg:flex-col"
            )}
          >
            <div className="flex h-full flex-col p-6">
              <Link href="/dashboard" className="hidden lg:flex items-center gap-2 mb-8">
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-semibold text-background shadow-[var(--shadow-soft)]">
                  A
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background"
                  />
                </span>
                <span className="font-semibold text-lg">Aurora</span>
              </Link>

              <LayoutGroup id="nav">
                <nav className="flex-1 space-y-1">
                  {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="relative block"
                      >
                        <span
                          className={cn(
                            "relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-xl bg-accent border border-border"
                            transition={{ type: "spring", stiffness: 320, damping: 28 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </LayoutGroup>

              <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" /> Local account
                  </span>
                  <ThemeToggle compact />
                </div>
                <button
                  onClick={onSignOut}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm font-medium text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.button
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm"
            aria-label="Close menu"
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <PageTransition key={pathname}>{children}</PageTransition>
      </main>
    </div>
  );
}
