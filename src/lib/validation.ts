import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email");

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a symbol");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirm: z.string(),
    accept: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const forgotSchema = z.object({ email: emailSchema });
export type ForgotInput = z.infer<typeof forgotSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d+$/, "Digits only"),
});
export type OtpInput = z.infer<typeof otpSchema>;

export const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(160).optional().default(""),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const newUserSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  role: z.enum(["Admin", "Editor", "Viewer"]).default("Viewer"),
});
export type NewUserInput = z.infer<typeof newUserSchema>;
