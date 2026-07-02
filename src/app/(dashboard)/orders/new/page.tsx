import { getVendorId } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { OrderForm } from "@/components/orders/order-form";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const vendorId = await getVendorId();
  if (!vendorId) redirect("/auth");

  const { customerId } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: { vendorId },
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true },
  });

  if (customerId) {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) redirect("/orders/new");
  }

  return (
    <div style={{ padding: "var(--space-4)", maxWidth: "640px", margin: "0 auto" }}>
      <OrderForm customers={customers} preselectedCustomerId={customerId} />
    </div>
  );
}
