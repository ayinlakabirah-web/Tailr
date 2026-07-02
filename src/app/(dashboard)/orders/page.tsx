import { getVendorId } from "@/lib/auth";
import prisma from "@/lib/db";
import { OrderCard } from "@/components/orders/order-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const vendorId = await getVendorId();
  if (!vendorId) redirect("/auth");

  const orders = await prisma.order.findMany({
    where: { customer: { vendorId } },
    include: {
      customer: { select: { fullName: true } },
      payment: { select: { status: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <h1 style={{ 
          fontSize: "var(--typography-headline-small-font-size)",
          lineHeight: "var(--typography-headline-small-line-height)",
          color: "var(--color-primary)" 
        }}>
          Orders
        </h1>
        <Link href="/orders/new">
          <Button size="sm">New Order</Button>
        </Link>
      </header>

      {orders.length === 0 ? (
        <EmptyState 
          title="No orders yet" 
          description="Create your first order to start tracking production and payments."
          actionLabel="New Order"
          onAction={async () => {
              "use server";
              redirect("/orders/new");
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {orders.map((order: { id: string; customer: { fullName: string }; outfitType: string; deliveryDate: Date; status: "NEW" | "IN_PROGRESS" | "READY" | "DELIVERED"; payment: { status: "UNPAID" | "PARTIALLY_PAID" | "PAID" } | null }) => (
            <OrderCard 
              key={order.id}
              id={order.id}
              customerName={order.customer.fullName}
              outfitType={order.outfitType}
              deliveryDate={order.deliveryDate}
              status={order.status}
              paymentStatus={order.payment?.status || "UNPAID"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
