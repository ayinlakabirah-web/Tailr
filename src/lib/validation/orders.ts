import { z } from "zod";

export const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  outfitType: z.string().min(2, "Outfit type is required"),
  quantity: z.number().int().positive().default(1),
  specialInstructions: z.string().optional(),
  deliveryDate: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0,0,0,0)), {
    message: "Delivery date cannot be in the past",
  }),
  totalAmount: z.number().positive("Total amount must be positive"),
  depositPaid: z.number().min(0, "Deposit cannot be negative").default(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "READY", "DELIVERED"]),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID"]),
  depositPaid: z.number().optional(),
});

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED"]),
  deliveredAt: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>;
