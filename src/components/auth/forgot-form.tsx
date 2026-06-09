"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "./form-field";
import { SubmitButton } from "./submit-button";
import { OTPInput } from "./otp-input";
import { forgotSchema, type ForgotInput } from "@/lib/validation";
import { requestOtp, verifyOtp } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ForgotFormProps = { onSwitch: (mode: "login") => void };
type Step = "email" | "code" | "done";

export function ForgotForm({ onSwitch }: ForgotFormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState<ForgotInput["email"]>("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [devCode, setDevCode] = useState<string | null>(null);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = forgotSchema.safeParse({ email });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setErr(null);
    setStatus("loading");
    try {
      const code = requestOtp(parsed.data.email);
      setDevCode(code); // demo only
      setStatus("idle");
      setStep("code");
      toast.message("Code sent", { description: "Check your email (and dev panel below)" });
    } catch {
      setStatus("idle");
    }
  };

  const verify = async (final: string) => {
    setErr(null);
    setStatus("loading");
    try {
      await verifyOtp(email, final);
      setStatus("success");
      setStep("done");
      toast.success("Code verified — you can sign in now");
      setTimeout(() => onSwitch("login"), 1400);
    } catch (e) {
      setStatus("idle");
      setErr(e instanceof Error ? e.message : "Could not verify");
      setCode("");
    }
  };

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.form
            key="email"
            onSubmit={sendCode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
            noValidate
          >
            <FormField
              label="Email address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr(null);
              }}
              error={err ?? undefined}
              autoComplete="email"
            />
            <SubmitButton status={status} loadingText="Sending code…">
              <KeyRound className="h-4 w-4" />
              Send reset code
            </SubmitButton>
          </motion.form>
        )}

        {step === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
            <OTPInput value={code} onChange={setCode} onComplete={verify} error={!!err} autoFocus />
            {err && (
              <motion.p
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -6, 6, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
                className="text-sm text-destructive"
                role="alert"
              >
                {err}
              </motion.p>
            )}
            {devCode && (
              <div
                className={cn(
                  "rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground"
                )}
              >
                <span className="font-medium text-foreground">Demo code:</span>{" "}
                <code className="rounded bg-background px-1.5 py-0.5 text-foreground">{devCode}</code>
                <span className="ml-2">(only visible because this is a local demo)</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                const c = requestOtp(email);
                setDevCode(c);
                setStatus("idle");
                toast.message("New code sent");
              }}
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              Resend code
            </button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-success"
          >
            Verified — redirecting to sign in…
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => onSwitch("login")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </button>
    </div>
  );
}
