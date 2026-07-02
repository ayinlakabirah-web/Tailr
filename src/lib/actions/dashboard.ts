"use server";

import prisma from "@/lib/db";
import { getVendorId } from "@/lib/auth";

export async function getDashboardStats() {
  const vendorId = await getVendorId();
  if (!vendorId) return null;

  const [totalCustomers, activeOrders, pendingDeliveries, outstandingPayments] = await Promise.all([
    prisma.customer.count({ where: { vendorId } }),
    prisma.order.count({ 
      where: { 
        customer: { vendorId },
        status: { not: "DELIVERED" }
      } 
    }),
    prisma.delivery.count({
      where: {
        order: { customer: { vendorId } },
        status: { not: "DELIVERED" }
      }
    }),
    prisma.payment.count({
      where: {
        order: { customer: { vendorId } },
        status: { not: "PAID" }
      }
    })
  ]);

  return {
    totalCustomers,
    activeOrders,
    pendingDeliveries,
    outstandingPayments
  };
}
