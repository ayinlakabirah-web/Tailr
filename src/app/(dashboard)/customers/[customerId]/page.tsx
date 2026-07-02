import { getCustomer } from "@/lib/actions/customers";
import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeasurementForm } from "@/components/customers/measurement-form";
import { DeleteCustomerButton } from "@/components/customers/delete-customer-button";
import { ArrowLeft, Phone, MapPin, Mail, ShoppingBag, Edit2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

interface CustomerPageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const { customerId } = await params;
  const customer = await getCustomer(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <div style={{ 
      padding: "var(--space-8) var(--space-6)", 
      display: "flex", 
      flexDirection: "column", 
      gap: "var(--space-8)",
      maxWidth: "1280px",
      margin: "0 auto",
      paddingBottom: "120px"
    }}>
      {/* Header & Back Button */}
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Link 
          href="/customers" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "var(--space-2)", 
            color: "var(--color-on-surface-variant)", 
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          <ArrowLeft size={16} /> Back to Customers
        </Link>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div>
            <h1 style={{ 
              fontSize: "var(--typography-headline-medium-font-size)", 
              fontWeight: "800", 
              color: "var(--color-on-surface)",
              margin: 0,
              marginBottom: "var(--space-2)"
            }}>
              {customer.fullName}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", color: "var(--color-on-surface-variant)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "14px" }}>
                <Phone size={14} /> {customer.phoneNumber}
              </div>
              {customer.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "14px" }}>
                  <Mail size={14} /> {customer.email}
                </div>
              )}
              {customer.address && (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "14px" }}>
                  <MapPin size={14} /> {customer.address}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link href={`/customers/${customer.id}/edit`}>
              <Button variant="secondary" size="sm">
                <Edit2 size={16} style={{ marginRight: "var(--space-2)" }} /> Edit Profile
              </Button>
            </Link>
            <DeleteCustomerButton customerId={customer.id} customerName={customer.fullName} />
            <Link href={`/orders/new?customerId=${customer.id}`}>
              <Button size="sm">
                <ShoppingBag size={18} style={{ marginRight: "var(--space-2)" }} /> Create Order
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
        gap: "var(--space-8)" 
      }}>
        {/* Left Column: Measurements */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <MeasurementForm 
            customerId={customer.id} 
            initialData={customer.measurements[0] || null} 
          />
        </section>

        {/* Right Column: Recent Activity / Orders */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <Card padding="lg">
            <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)", marginBottom: "var(--space-6)" }}>
              Recent Orders
            </h2>
            
            {customer.orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-8) 0", opacity: 0.6 }}>
                <ShoppingBag size={40} style={{ margin: "0 auto", marginBottom: "var(--space-4)", display: "block" }} strokeWidth={1} />
                <p>No orders yet for this customer.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {customer.orders.map((order: { id: string; outfitType: string; status: string; createdAt: Date }) => (
                  <div key={order.id} style={{ 
                    padding: "var(--space-3)", 
                    borderRadius: "8px", 
                    border: "1px solid var(--color-outline-variant)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>{order.outfitType}</div>
                      <div style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      padding: "4px 8px", 
                      borderRadius: "16px", 
                      backgroundColor: "var(--color-secondary-container)", 
                      color: "var(--color-on-secondary-container)",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>
                      {order.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {customer.orders.length > 0 && (
              <Button variant="ghost" style={{ width: "100%", marginTop: "var(--space-4)" }}>
                View All Orders
              </Button>
            )}
          </Card>
        </section>
      </div>

      <Navigation />
    </div>
  );
}
