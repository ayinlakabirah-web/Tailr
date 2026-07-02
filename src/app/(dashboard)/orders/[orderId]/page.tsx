import { getOrder, updateOrderStatus } from "@/lib/actions/orders";
import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { ArrowLeft, Phone, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: { toString: () => string }): string {
  return `₦${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    READY: "Ready",
    DELIVERED: "Delivered",
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
    PENDING: "Pending",
    SHIPPED: "Shipped",
  };
  return map[status] ?? status;
}

const statusFlow: { value: "NEW" | "IN_PROGRESS" | "READY" | "DELIVERED"; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "READY", label: "Ready" },
  { value: "DELIVERED", label: "Delivered" },
];

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  const currentIndex = statusFlow.findIndex((s) => s.value === order.status);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  return (
    <div style={{
      padding: "var(--space-8) var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
      maxWidth: "900px",
      margin: "0 auto",
      paddingBottom: "120px",
    }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Link
          href="/orders"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            color: "var(--color-on-surface-variant)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div>
            <h1 style={{
              fontSize: "var(--typography-headline-medium-font-size)",
              fontWeight: "800",
              color: "var(--color-on-surface)",
              margin: 0,
              marginBottom: "var(--space-2)",
            }}>
              {order.outfitType}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", color: "var(--color-on-surface-variant)", fontSize: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                <User size={14} /> {order.customer.fullName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                <Phone size={14} /> {order.customer.phoneNumber}
              </div>
            </div>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>
      </header>

      {/* Status flow */}
      <Card padding="lg">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)" }}>
            Progress
          </h2>
          <span style={{ fontSize: "14px", color: "var(--color-on-surface-variant)", marginLeft: "auto" }}>
            Ordered {formatDate(order.createdAt)}
          </span>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
          {statusFlow.map((step, i) => {
            const isActive = i <= currentIndex;
            return (
              <div key={step.value} style={{
                flex: 1,
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "8px",
                backgroundColor: isActive ? "var(--color-primary-container)" : "var(--color-surface-container)",
                color: isActive ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
                fontWeight: isActive ? "600" : "400",
                fontSize: "13px",
                textAlign: "center",
              }}>
                {step.label}
              </div>
            );
          })}
        </div>

        {nextStatus && (
          <form action={async () => {
            "use server";
            await updateOrderStatus(order.id, { status: nextStatus.value });
            redirect(`/orders/${order.id}`);
          }}>
            <Button type="submit" style={{ width: "100%" }}>
              Mark as {nextStatus.label}
            </Button>
          </form>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
        {/* Order details */}
        <Card padding="lg">
          <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)", marginBottom: "var(--space-6)" }}>
            Order Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <DetailRow label="Outfit Type" value={order.outfitType} />
            <DetailRow label="Quantity" value={String(order.quantity)} />
            <DetailRow label="Delivery Date" value={formatDate(order.deliveryDate)} />
            {order.specialInstructions && (
              <div>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-on-surface-variant)" }}>
                  Instructions
                </span>
                <p style={{ margin: "var(--space-1) 0 0", fontSize: "14px", color: "var(--color-on-surface)", whiteSpace: "pre-wrap" }}>
                  {order.specialInstructions}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment */}
        <Card padding="lg">
          <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)", marginBottom: "var(--space-6)" }}>
            Payment
          </h2>

          {order.payment ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <DetailRow label="Total" value={formatCurrency(order.payment.totalAmount)} />
              <DetailRow label="Deposit Paid" value={formatCurrency(order.payment.depositPaid)} />
              <DetailRow label="Balance" value={formatCurrency(order.payment.balanceRemaining)} />
              <div>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-on-surface-variant)" }}>
                  Status
                </span>
                <div style={{ marginTop: "var(--space-1)" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: order.payment.status === "PAID" ? "var(--color-primary-container)" : order.payment.status === "PARTIALLY_PAID" ? "var(--color-tertiary-container)" : "var(--color-error-container)",
                    color: order.payment.status === "PAID" ? "var(--color-on-primary-container)" : order.payment.status === "PARTIALLY_PAID" ? "var(--color-on-tertiary-container)" : "var(--color-on-error-container)",
                  }}>
                    {statusLabel(order.payment.status)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--color-on-surface-variant)", fontSize: "14px" }}>No payment record.</p>
          )}
        </Card>

        {/* Delivery */}
        <Card padding="lg">
          <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)", marginBottom: "var(--space-6)" }}>
            Delivery
          </h2>

          {order.delivery ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <DetailRow label="Date" value={formatDate(order.delivery.deliveryDate)} />
              <div>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-on-surface-variant)" }}>
                  Status
                </span>
                <div style={{ marginTop: "var(--space-1)" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: order.delivery.status === "DELIVERED" ? "var(--color-primary-container)" : order.delivery.status === "SHIPPED" ? "var(--color-tertiary-container)" : "var(--color-surface-container)",
                    color: order.delivery.status === "DELIVERED" ? "var(--color-on-primary-container)" : order.delivery.status === "SHIPPED" ? "var(--color-on-tertiary-container)" : "var(--color-on-surface-variant)",
                  }}>
                    {statusLabel(order.delivery.status)}
                  </span>
                </div>
              </div>
              {order.delivery.deliveredAt && (
                <DetailRow label="Delivered At" value={formatDate(order.delivery.deliveredAt)} />
              )}
            </div>
          ) : (
            <p style={{ color: "var(--color-on-surface-variant)", fontSize: "14px" }}>No delivery record.</p>
          )}
        </Card>
      </div>

      <Navigation />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-on-surface-variant)" }}>
        {label}
      </span>
      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-on-surface)", marginTop: "var(--space-1)" }}>
        {value}
      </div>
    </div>
  );
}
