import Link from "next/link";

type OrderStatus = "NEW" | "IN_PROGRESS" | "READY" | "DELIVERED";
type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";

type OrderCardProps = {
  id: string;
  customerName: string;
  outfitType: string;
  deliveryDate: Date;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    READY: "Ready",
    DELIVERED: "Delivered",
  };
  return map[status];
}

function paymentLabel(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
  };
  return map[status];
}

export function OrderCard({
  id,
  customerName,
  outfitType,
  deliveryDate,
  status,
  paymentStatus,
}: OrderCardProps) {
  return (
    <Link
      href={`/orders/${id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        padding: "var(--space-3) var(--space-4)",
        backgroundColor: "var(--color-surface-container)",
        borderRadius: "var(--space-3)",
        border: "1px solid var(--color-outline-variant)",
        textDecoration: "none",
        color: "var(--color-on-surface)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "600", fontSize: "var(--typography-body-medium-font-size)", lineHeight: "var(--typography-body-medium-line-height)" }}>
          {customerName}
        </span>
        <span style={{ fontSize: "var(--typography-label-small-font-size)", lineHeight: "var(--typography-label-small-line-height)", color: "var(--color-primary)" }}>
          {statusLabel(status)}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "var(--typography-label-small-font-size)", lineHeight: "var(--typography-label-small-line-height)", color: "var(--color-on-surface-variant)" }}>
          {outfitType} · {formatDate(deliveryDate)}
        </span>
        <span style={{ fontSize: "var(--typography-label-small-font-size)", lineHeight: "var(--typography-label-small-line-height)", color: "var(--color-on-surface-variant)" }}>
          {paymentLabel(paymentStatus)}
        </span>
      </div>
    </Link>
  );
}
