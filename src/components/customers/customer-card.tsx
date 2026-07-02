import Link from "next/link";

type CustomerCardProps = {
  id: string;
  fullName: string;
  phoneNumber: string;
  orderCount: number;
};

export function CustomerCard({ id, fullName, phoneNumber, orderCount }: CustomerCardProps) {
  return (
    <Link
      href={`/customers/${id}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--space-3) var(--space-4)",
        backgroundColor: "var(--color-surface-container)",
        borderRadius: "var(--space-3)",
        border: "1px solid var(--color-outline-variant)",
        textDecoration: "none",
        color: "var(--color-on-surface)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-0)" }}>
        <span style={{ fontWeight: "600", fontSize: "var(--typography-body-medium-font-size)", lineHeight: "var(--typography-body-medium-line-height)" }}>
          {fullName}
        </span>
        <span style={{ fontSize: "var(--typography-label-small-font-size)", lineHeight: "var(--typography-label-small-line-height)", color: "var(--color-on-surface-variant)" }}>
          {phoneNumber}
        </span>
      </div>
      <span style={{ fontSize: "var(--typography-label-small-font-size)", lineHeight: "var(--typography-label-small-line-height)", color: "var(--color-on-surface-variant)" }}>
        {orderCount} order{orderCount !== 1 ? "s" : ""}
      </span>
    </Link>
  );
}
