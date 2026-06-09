"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, LogIn, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { SubmitButton } from "./submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Magnetic } from "@/components/motion/magnetic";
import { signIn } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  onSwitch: (mode: "signup" | "forgot") => void;
};

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

export function LoginForm({ onSwitch }: LoginFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const update = <K extends keyof LoginInput>(k: K, v: LoginInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        fe[issue.path[0] as keyof LoginInput] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setStatus("loading");
    try {
      await signIn(parsed.data);
      setStatus("success");
      toast.success("Welcome back!");
      setTimeout(() => router.push("/dashboard/welcome"), 700);
    } catch (err) {
      setStatus("idle");
      setErrors({ password: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormField
        label="Email address"
        type="email"
        icon={<Mail className="h-4 w-4" />}
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        error={errors.email}
        autoComplete="email"
        success={!errors.email && form.email.includes("@")}
      />
      <PasswordInput
        value={form.password}
        onChange={(e) => update("password", e.target.value)}
        error={errors.password}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={!!form.remember}
            onCheckedChange={(v) => update("remember", !!v)}
          />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => onSwitch("forgot")}
          className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
        >
          <KeyRound className="h-3.5 w-3.5" /> Forgot?
        </button>
      </div>

      <SubmitButton status={status} successText="Signed in" successConfetti>
        <LogIn className="h-4 w-4" />
        Sign in
      </SubmitButton>

      <AnimatePresence>
        <motion.p
          key="demo-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground"
        >
          Try the demo:{" "}
          <button
            type="button"
            onClick={() => {
              update("email", "demo@aurora.app");
              update("password", "demo1234");
            }}
            className="text-primary hover:underline underline-offset-4 font-medium"
          >
            demo@aurora.app · demo1234
          </button>
        </motion.p>
      </AnimatePresence>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <SwitchLink onClick={() => onSwitch("signup")}>Create an account</SwitchLink>
      </p>
    </form>
  );
}

function SwitchLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Magnetic strength={0.25}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative font-semibold text-foreground hover:text-primary transition-colors",
          "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform",
          "hover:after:scale-x-100"
        )}
      >
        {children}
      </button>
    </Magnetic>
  );
}
