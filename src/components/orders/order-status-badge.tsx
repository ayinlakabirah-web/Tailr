type OrderStatus = "NEW" | "IN_PROGRESS" | "READY" | "DELIVERED";

function statusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    NEW: "New",
    IN_PROGRESS: "In Progress",
    READY: "Ready",
    DELIVERED: "Delivered",
  };
  return map[status];
}

const statusStyles: Record<OrderStatus, React.CSSProperties> = {
  NEW: {
    backgroundColor: "var(--color-surface-container)",
    color: "var(--color-on-surface-variant)",
  },
  IN_PROGRESS: {
    backgroundColor: "var(--color-tertiary-container)",
    color: "var(--color-on-tertiary-container)",
  },
  READY: {
    backgroundColor: "var(--color-secondary-container)",
    color: "var(--color-on-secondary-container)",
  },
  DELIVERED: {
    backgroundColor: "var(--color-primary-container)",
    color: "var(--color-on-primary-container)",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 14px",
      borderRadius: "16px",
      fontSize: "13px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.03em",
      ...statusStyles[status],
    }}>
      {statusLabel(status)}
    </span>
  );
}
