import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export const extraMeasurementSchema = z.object({
  name: z.string().min(1, "Measurement name is required"),
  value: z.coerce.number().default(0),
});

export const measurementSchema = z.object({
  shoulder: z.coerce.number().optional().nullable(),
  bust: z.coerce.number().optional().nullable(),
  waist: z.coerce.number().optional().nullable(),
  hip: z.coerce.number().optional().nullable(),
  sleeve: z.coerce.number().optional().nullable(),
  armhole: z.coerce.number().optional().nullable(),
  thigh: z.coerce.number().optional().nullable(),
  trouserLength: z.coerce.number().optional().nullable(),
  extraMeasurements: z.array(extraMeasurementSchema).optional().default([]),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type MeasurementInput = z.infer<typeof measurementSchema>;
export type ExtraMeasurementInput = z.infer<typeof extraMeasurementSchema>;
