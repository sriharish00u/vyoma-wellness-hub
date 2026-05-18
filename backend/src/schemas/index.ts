import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
