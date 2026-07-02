import { getVendorId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Navigation } from "@/components/ui/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";

function formatCurrency(amount: { toString: () => string }): string {
  return `₦${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
  };
  return map[status] ?? status;
}

const statusStyles: Record<string, React.CSSProperties> = {
  PAID: {
    backgroundColor: "var(--color-primary-container)",
    color: "var(--color-on-primary-container)",
  },
  PARTIALLY_PAID: {
    backgroundColor: "var(--color-tertiary-container)",
    color: "var(--color-on-tertiary-container)",
  },
  UNPAID: {
    backgroundColor: "var(--color-error-container)",
    color: "var(--color-on-error-container)",
  },
};

export default async function PaymentsPage() {
  const vendorId = await getVendorId();
  if (!vendorId) redirect("/auth");

  const payments = await prisma.payment.findMany({
    where: { order: { customer: { vendorId } } },
    include: {
      order: {
        select: {
          id: true,
          outfitType: true,
          customer: { select: { fullName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
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
          Payments
        </h1>
      </header>

      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Payments will appear here once you create orders with recorded amounts."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {payments.map((payment: { 
            id: string; 
            status: "UNPAID" | "PARTIALLY_PAID" | "PAID"; 
            totalAmount: { toString: () => string };
            depositPaid: { toString: () => string };
            order: { 
              id: string; 
              outfitType: string; 
              customer: { fullName: string } 
            } 
          }) => (
            <Link
              key={payment.id}
              href={`/orders/${payment.order.id}`}
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
                    {payment.order.customer.fullName}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
                    {payment.order.outfitType}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--color-on-surface)" }}>
                    {formatCurrency(payment.totalAmount)}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
                    Paid: {formatCurrency(payment.depositPaid)}
                  </div>
                </div>
                <span style={{
                  display: "inline-flex",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  ...(statusStyles[payment.status] || statusStyles.UNPAID),
                }}>
                  {statusLabel(payment.status)}
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
