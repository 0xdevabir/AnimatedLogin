"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, User, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { SubmitButton } from "./submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Magnetic } from "@/components/motion/magnetic";
import { signUp } from "@/lib/auth";
import { signupSchema, type SignupInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

type SignupFormProps = { onSwitch: (mode: "login") => void };

type FieldErrors = Partial<Record<keyof SignupInput, string>>;

export function SignupForm({ onSwitch }: SignupFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    accept: true,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const update = <K extends keyof SignupInput>(k: K, v: SignupInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        fe[issue.path[0] as keyof SignupInput] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setStatus("loading");
    try {
      await signUp({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setStatus("success");
      toast.success("Account created — welcome aboard!");
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (err) {
      setStatus("idle");
      setErrors({ email: err instanceof Error ? err.message : "Could not create account" });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormField
        label="Full name"
        icon={<User className="h-4 w-4" />}
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
        autoComplete="name"
      />
      <FormField
        label="Email address"
        type="email"
        icon={<Mail className="h-4 w-4" />}
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <PasswordInput
        label="Create password"
        value={form.password}
        onChange={(e) => update("password", e.target.value)}
        error={errors.password}
        showStrength
      />
      <PasswordInput
        label="Confirm password"
        value={form.confirm}
        onChange={(e) => update("confirm", e.target.value)}
        error={errors.confirm}
        autoComplete="new-password"
      />

      <label className="flex items-start gap-2 cursor-pointer select-none">
        <Checkbox
          checked={!!form.accept}
          onCheckedChange={(v) => update("accept", !!v as never)}
          className="mt-0.5"
        />
        <span className="text-xs text-muted-foreground">
          I agree to the{" "}
          <a className="text-foreground hover:text-primary underline-offset-4 hover:underline" href="#">Terms</a>{" "}
          and{" "}
          <a className="text-foreground hover:text-primary underline-offset-4 hover:underline" href="#">Privacy Policy</a>
        </span>
      </label>
      {errors.accept && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> {errors.accept}
        </p>
      )}

      <SubmitButton status={status} successText="Account created" successConfetti>
        <UserPlus className="h-4 w-4" />
        Create account
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Magnetic strength={0.25}>
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className={cn(
              "relative font-semibold text-foreground hover:text-primary transition-colors",
              "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform",
              "hover:after:scale-x-100"
            )}
          >
            Sign in instead
          </button>
        </Magnetic>
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-[11px] text-muted-foreground"
      >
        Your data stays in your browser. Nothing leaves this device.
      </motion.p>
    </form>
  );
}
