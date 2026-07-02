"use server";

import prisma from "@/lib/db";
import { getVendorId } from "@/lib/auth";
import { 
  customerSchema, 
  measurementSchema, 
  CustomerInput, 
  MeasurementInput 
} from "@/lib/validation/customers";
import { ActionResult } from "./types";
import { revalidatePath } from "next/cache";

/**
 * Creates a new customer for the authenticated vendor.
 * Includes duplicate detection per business rules.
 */
export async function createCustomer(input: CustomerInput): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Auth check
    const vendorId = await getVendorId();
    if (!vendorId) return { success: false, error: "Unauthorized" };

    // 2. Validate input
    const validated = customerSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { fullName, phoneNumber, email, address } = validated.data;

    // 3. Duplicate detection (same name/phone for same vendor)
    const existing = await prisma.customer.findFirst({
      where: {
        fullName: { equals: fullName, mode: "insensitive" },
        phoneNumber,
        vendorId,
      },
    });

    if (existing) {
      return { success: false, error: "A customer with this name and phone number already exists." };
    }

    // 4. Create customer
    const customer = await prisma.customer.create({
      data: {
        fullName,
        phoneNumber,
        email: email || null,
        address: address || null,
        vendorId,
      },
    });

    revalidatePath("/customers");
    revalidatePath("/dashboard");
    
    return { success: true, data: { id: customer.id } };
  } catch (error) {
    console.error("Create customer error:", error);
    return { success: false, error: "Failed to create customer." };
  }
}

/**
 * Updates an existing customer.
 * Verifies ownership before mutation.
 */
export async function updateCustomer(id: string, input: CustomerInput): Promise<ActionResult> {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return { success: false, error: "Unauthorized" };

    const validated = customerSchema.safeParse(input);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };

    // Verify ownership
    const customer = await prisma.customer.findFirst({
      where: { id, vendorId },
    });

    if (!customer) return { success: false, error: "Customer not found." };

    await prisma.customer.update({
      where: { id },
      data: {
        ...validated.data,
        email: validated.data.email || null,
        address: validated.data.address || null,
      },
    });

    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update customer error:", error);
    return { success: false, error: "Failed to update customer." };
  }
}

/**
 * Deletes a customer.
 * Restricted if active orders exist (Business Rule).
 */
export async function deleteCustomer(id: string): Promise<ActionResult> {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return { success: false, error: "Unauthorized" };

    // Verify ownership and check orders
    const customer = await prisma.customer.findFirst({
      where: { id, vendorId },
      include: {
        _count: {
          select: { orders: { where: { status: { not: "DELIVERED" } } } }
        }
      }
    });

    if (!customer) return { success: false, error: "Customer not found." };
    
    if (customer._count.orders > 0) {
      return { success: false, error: "Cannot delete a customer with active orders." };
    }

    await prisma.customer.delete({ where: { id } });

    revalidatePath("/customers");
    revalidatePath("/dashboard");
    
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete customer error:", error);
    return { success: false, error: "Failed to delete customer." };
  }
}

/**
 * Updates or creates the measurement record for a customer.
 * Ensures "update in place" logic per business rules.
 */
export async function updateMeasurements(customerId: string, input: MeasurementInput): Promise<ActionResult> {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return { success: false, error: "Unauthorized" };

    const validated = measurementSchema.safeParse(input);
    if (!validated.success) return { success: false, error: validated.error.issues[0].message };

    // Verify customer ownership
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, vendorId },
    });

    if (!customer) return { success: false, error: "Customer not found." };

    // Upsert measurement (update in place or create)
    await prisma.measurement.upsert({
      where: { customerId },
      update: validated.data,
      create: { 
        ...validated.data,
        customerId 
      },
    });

    revalidatePath(`/customers/${customerId}`);
    
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update measurements error:", error);
    return { success: false, error: "Failed to save measurements." };
  }
}

/**
 * Fetches a single customer with their measurements and recent orders.
 * Strictly scoped to the authenticated vendor.
 */
export async function getCustomer(id: string) {
  try {
    const vendorId = await getVendorId();
    if (!vendorId) return null;

    const customer = await prisma.customer.findFirst({
      where: { id, vendorId },
      include: {
        measurements: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return customer;
  } catch (error) {
    console.error("Get customer error:", error);
    return null;
  }
}
