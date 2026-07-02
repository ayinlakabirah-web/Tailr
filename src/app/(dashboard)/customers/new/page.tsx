import { CustomerForm } from "@/components/customers/customer-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewCustomerPage() {
  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <Link href="/customers">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 style={{ 
          fontSize: "var(--typography-headline-small-font-size)",
          lineHeight: "var(--typography-headline-small-line-height)",
          color: "var(--color-primary)" 
        }}>
          New Customer
        </h1>
      </header>

      <div style={{ maxWidth: "500px" }}>
        <CustomerForm />
      </div>
    </div>
  );
}
