"use server";

import prisma from "@/lib/db";
import { getVendorId } from "@/lib/auth";
import { 
  orderSchema, 
  OrderInput, 
  updateOrderStatusSchema,
  UpdateOrderStatusInput 
} from "@/lib/validation/orders";
import { ActionResult } from "./types";
import { revalidatePath } from "next/cache";

/**
 * Creates an order along with its associated Payment and Delivery records.
 * Atomic operation using prisma.$transaction.
 */
export async function createOrder(input: OrderInput): Promise<ActionResult<{ id: string }>> {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return { success: false, error: "Unauthorized" };

    const validated = orderSchema.safeParse(input);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };

    const { 
      customerId, 
      outfitType, 
      quantity, 
      specialInstructions, 
      deliveryDate,
      totalAmount,
      depositPaid
    } = validated.data;

    // Verify customer ownership
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, vendorId }
    });

    if (!customer) return { success: false, error: "Customer not found." };

    // Atomic transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          customerId,
          outfitType,
          quantity,
          specialInstructions,
          deliveryDate: new Date(deliveryDate),
          status: "NEW",
        }
      });

      // 2. Create the Payment
      const balanceRemaining = totalAmount - depositPaid;
      const paymentStatus = depositPaid === 0 ? "UNPAID" : (balanceRemaining === 0 ? "PAID" : "PARTIALLY_PAID");
      
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          totalAmount,
          depositPaid,
          balanceRemaining,
          status: paymentStatus,
        }
      });

      // 3. Create the Delivery
      await tx.delivery.create({
        data: {
          orderId: newOrder.id,
          deliveryDate: new Date(deliveryDate),
          status: "PENDING",
        }
      });

      return newOrder;
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath(`/customers/${customerId}`);

    return { success: true, data: { id: order.id } };
  } catch (error) {
    console.error("Create order error:", error);
    return { success: false, error: "Failed to create order." };
  }
}

/**
 * Fetches a single order with all relations.
 * Strictly vendor-scoped.
 */
export async function getOrder(id: string) {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return null;

    const order = await prisma.order.findFirst({
      where: { id, customer: { vendorId } },
      include: {
        customer: true,
        payment: true,
        delivery: true,
      },
    });

    return order;
  } catch (error) {
    console.error("Get order error:", error);
    return null;
  }
}

/**
 * Updates an order status.
 */
export async function updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<ActionResult> {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return { success: false, error: "Unauthorized" };

    const validated = updateOrderStatusSchema.safeParse(input);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };

    // Verify ownership via customer
    const order = await prisma.order.findFirst({
      where: { id, customer: { vendorId } }
    });

    if (!order) return { success: false, error: "Order not found." };

    await prisma.order.update({
      where: { id },
      data: { status: validated.data.status }
    });

    revalidatePath(`/orders/${id}`);
    revalidatePath("/dashboard");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}
