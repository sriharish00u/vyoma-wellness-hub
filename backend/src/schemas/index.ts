import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const programSchema = z.object({
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  level: z.enum(["Beginner", "Intermediate", "All levels"], {
    errorMap: () => ({ message: "Level must be Beginner, Intermediate, or All levels" }),
  }),
  duration: z.string().min(2, "Duration required (e.g. '20 min')"),
  tag: z.enum(["Yoga", "Fitness", "Breathwork", "Meditation", "Motivation"], {
    errorMap: () => ({ message: "Tag must be one of: Yoga, Fitness, Breathwork, Meditation, Motivation" }),
  }),
  desc: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Icon name required (e.g. 'Sunrise')"),
  order: z.number().int().positive().optional(),
});

export const sessionSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  programSlug: z.string().min(2),
  coach: z.string().min(2),
  scheduledAt: z.string().datetime(),
  durationMin: z.number().int().positive(),
  joinLink: z.string().url().optional().or(z.literal("")),
  isLive: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["workshop", "challenge", "webinar", "community"]),
  scheduledAt: z.string().datetime(),
  durationMin: z.number().int().positive(),
  mode: z.enum(["online", "offline"]),
  joinLink: z.string().url().optional().or(z.literal("")),
  place: z.string().optional(),
  status: z.enum(["upcoming", "live", "completed"]).optional(),
  recordingUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().optional(),
  order: z.number().int().optional(),
});

export const trialRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  age: z.coerce.number().min(5, "Please enter a valid age (minimum 5)").max(120, "Please enter a valid age"),
  whatsappNumber: z.string().min(8, "Please enter a valid WhatsApp / Phone number"),
  email: z.string().email("Please enter a valid email address"),
  profession: z.string().min(1, "Please select your profession"),
  professionOther: z.string().optional().default(""),
  yogaExperience: z.string().min(1, "Please select your yoga experience"),
  goals: z.array(z.string()).min(1, "Please select at least one goal/benefit"),
  goalsOther: z.string().optional().default(""),
  hopesToGain: z.string().optional().default(""),
  hasPhysicalRestrictions: z.enum(["No", "Yes"], {
    errorMap: () => ({ message: "Please select if you have physical restrictions" }),
  }),
  physicalRestrictionsDetail: z.string().optional().default(""),
  morningCommitment: z.string().min(1, "Please select your commitment level"),
  comfortableFollowingGuidance: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please select if you are comfortable following guidance" }),
  }),
  hearAbout: z.string().optional().default(""),
  hearAboutOther: z.string().optional().default(""),
  agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the confirmation terms to register"),
  futureUpdates: z.string().optional().default(""),
});
