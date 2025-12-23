import { z } from "zod";

export const doctorZodSchema = z.object({
  name: z.string().min(1, "Name is required"),

  specialization: z.string().min(1, "Specialization is required"),

  availability: z
    .enum(["Available", "Not Available", "Break"])
    .default("Available"),

  avgConsultationTime: z
    .number()
    .int()
    .positive()
    .default(8),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});
