import { getVendorId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Navigation } from "@/components/ui/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
  };
  return map[status] ?? status;
}

const statusStyles: Record<string, React.CSSProperties> = {
  DELIVERED: {
    backgroundColor: "var(--color-primary-container)",
    color: "var(--color-on-primary-container)",
  },
  SHIPPED: {
    backgroundColor: "var(--color-tertiary-container)",
    color: "var(--color-on-tertiary-container)",
  },
  PENDING: {
    backgroundColor: "var(--color-surface-container)",
    color: "var(--color-on-surface-variant)",
  },
};

export default async function DeliveriesPage() {
  const vendorId = await getVendorId();
  if (!vendorId) redirect("/auth");

  const deliveries = await prisma.delivery.findMany({
    where: { order: { customer: { vendorId } } },
    include: {
      order: {
        select: {
          id: true,
          outfitType: true,
          deliveryDate: true,
          customer: { select: { fullName: true } },
        },
      },
    },
    orderBy: { deliveryDate: "asc" },
  });

  return (
    <div style={{
      padding: "var(--space-8) var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
      maxWidth: "900px",
      margin: "0 auto",
      paddingBottom: "120px",
    }}>
      <header>
        <h1 style={{
          fontSize: "var(--typography-headline-small-font-size)",
          color: "var(--color-primary)",
          margin: 0,
        }}>
          Deliveries
        </h1>
      </header>

      {deliveries.length === 0 ? (
        <EmptyState
          title="No deliveries yet"
          description="Deliveries will appear here once you create orders with delivery dates."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {deliveries.map((delivery) => (
            <Link
              key={delivery.id}
              href={`/orders/${delivery.order.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card padding="md" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--space-4)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-on-surface)" }}>
                    {delivery.order.customer.fullName}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
                    {delivery.order.outfitType}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
                  <div>{formatDate(delivery.deliveryDate)}</div>
                </div>
                <span style={{
                  display: "inline-flex",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  ...(statusStyles[delivery.status] || statusStyles.PENDING),
                }}>
                  {statusLabel(delivery.status)}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Navigation />
    </div>
  );
}
