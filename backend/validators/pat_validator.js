import { z } from "zod";

export const patientZodSchema = z.object({
  name: z.string()
    .min(1, "Patient name is required"),

  doctorId: z.string()
    .min(1, "Doctor ID is required"),
  description: z.string()
    .min(1, "Description is required"),
  tokenNumber: z
    .number()
    .int()
    .positive(),

  status: z
    .enum(["waiting", "completed", "cancelled"])
    .default("waiting"),

  uniqueLinkId: z
    .string()
    .min(1, "Unique link ID is required"),

  createdAt: z
    .date()
    .optional(),

  completedAt: z
    .date()
    .optional(),
});
