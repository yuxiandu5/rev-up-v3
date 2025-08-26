import { z } from "zod";

// Backend schemas (for API validation)
export const registerSchema = z.object({
  userName: z.string().max(254),
  password: z.string().min(8).max(128),
  recoverQuestion: z.string().max(254),
  answer: z.string().max(254),
});

export const loginSchema = z.object({
  userName: z.string().max(254),
  password: z.string(),
});

export const verifyAnswerSchema = z.object({
  userName: z.string().max(254),
  answer: z.string().max(254),
});

export const requestPasswordResetSchema = z.object({
  userName: z.string().max(254),
  answer: z.string().max(254),
});

// Frontend schemas (with additional UI requirements)
export const registerFormSchema = z.object({
  userName: z.string()
    .min(1, "User name is required")
    .max(254, "User name is too long"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  recoverQuestion: z.string()
    .min(1, "Recover question is required")
    .max(254, "Recover question is too long"),
  answer: z.string()
    .min(1, "Answer is required")
    .max(254, "Answer is too long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginFormSchema = z.object({
  userName: z.string()
    .min(1, "User name is required")
    .max(254, "User name is too long"),
  password: z.string()
    .min(1, "Password is required"),
});

export const verifyUsernameSchema = z.object({
  userName: z.string().max(254),
});

export const verifyAnswerFormSchema = z.object({
  answer: z.string().max(254),
}); 

export const requestPasswordResetFormSchema = z.object({
  newPassword: z.string()
    .min(1, "New password is required")
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password is too long"),
  confirmPassword: z.string()
    .min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type VerifyUsernameInput = z.infer<typeof verifyUsernameSchema>;
export type VerifyAnswerInput = z.infer<typeof verifyAnswerSchema>;
export type VerifyAnswerFormInput = z.infer<typeof verifyAnswerFormSchema>;
export type RequestPasswordResetFormInput = z.infer<typeof requestPasswordResetFormSchema>;