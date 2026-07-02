import { getVendorId } from "@/lib/auth";
import prisma from "@/lib/db";
import { CustomerCard } from "@/components/customers/customer-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const vendorId = await getVendorId();
  if (!vendorId) redirect("/auth");

  const customers = await prisma.customer.findMany({
    where: { vendorId },
    include: {
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { fullName: "asc" }
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
          Customers
        </h1>
        <Link href="/customers/new">
          <Button size="sm">Add Customer</Button>
        </Link>
      </header>

      {customers.length === 0 ? (
        <EmptyState 
          title="No customers yet" 
          description="Start by adding your first customer to track their measurements and orders."
          actionLabel="Add Customer"
          onAction={async () => {
              "use server";
              redirect("/customers/new");
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {customers.map((customer: { id: string; fullName: string; phoneNumber: string; _count: { orders: number } }) => (
            <CustomerCard 
              key={customer.id}
              id={customer.id}
              fullName={customer.fullName}
              phoneNumber={customer.phoneNumber}
              orderCount={customer._count.orders}
            />
          ))}
        </div>
      )}
    </div>
  );
}
