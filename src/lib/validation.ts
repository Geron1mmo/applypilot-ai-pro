import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[a-z]/, "Include at least one lowercase letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: "You must accept the terms" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional().default(""),
  workMode: z.enum(["remote", "hybrid", "onsite"]).default("remote"),
  salaryMin: z.coerce.number().nullable().optional(),
  salaryMax: z.coerce.number().nullable().optional(),
  currency: z.string().default("USD"),
  jobUrl: z.string().url("Enter a valid URL").or(z.literal("")).optional().default(""),
  hrName: z.string().optional().default(""),
  hrEmail: z
    .string()
    .email("Enter a valid email")
    .or(z.literal(""))
    .optional()
    .default(""),
  status: z
    .enum(["saved", "applied", "interview", "technical", "offer", "rejected"])
    .default("saved"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  deadline: z.string().nullable().optional(),
  dateApplied: z.string().nullable().optional(),
  notes: z.string().optional().default(""),
  jobDescription: z.string().optional().default(""),
})

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  jobTargetTitle: z.string().optional().default(""),
  location: z.string().optional().default(""),
  preferredWorkMode: z.enum(["remote", "hybrid", "onsite"]).default("remote"),
  bio: z.string().max(500).optional().default(""),
  skills: z.string().optional().default(""),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[a-z]/, "Include at least one lowercase letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const documentSchema = z.object({
  type: z.enum(["cv", "cover-letter"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional().default(""),
  isPrimary: z.boolean().optional().default(false),
})

export const importDataSchema = z.object({
  version: z.string(),
  users: z.array(z.unknown()).optional(),
  applications: z.array(z.unknown()).optional(),
  analyses: z.array(z.unknown()).optional(),
  documents: z.array(z.unknown()).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type DocumentInput = z.infer<typeof documentSchema>