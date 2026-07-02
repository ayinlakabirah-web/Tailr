import { getDashboardStats } from "@/lib/actions/dashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { 
  PlusCircle, 
  UserPlus, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Users,
  ShoppingBag
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth");

  const [stats, user] = await Promise.all([
    getDashboardStats(),
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { fullName: true, businessName: true }
    })
  ]);

  if (!stats) redirect("/auth");

  const hour = new Date().getHours();
  const greeting = 
    hour < 12 ? "Good Morning" : 
    hour < 17 ? "Good Afternoon" : 
    "Good Evening";

  const statCards = [
    { label: "Total Customers", value: stats.totalCustomers, color: "var(--color-primary)", icon: Users },
    { label: "Active Orders", value: stats.activeOrders, color: "var(--color-secondary)", icon: TrendingUp },
    { label: "Pending Delivery", value: stats.pendingDeliveries, color: "var(--color-tertiary)", icon: Clock },
    { label: "Outstanding Payments", value: stats.outstandingPayments, color: "var(--color-error)", icon: AlertCircle },
  ];

  return (
    <div style={{ 
      padding: "var(--space-8) var(--space-6)", 
      display: "flex", 
      flexDirection: "column", 
      gap: "var(--space-12)",
      maxWidth: "1280px",
      margin: "0 auto",
      minHeight: "100vh",
      paddingBottom: "120px" // Generous bottom padding for nav
    }}>
      {/* Header */}
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <span style={{ 
            fontSize: "var(--typography-label-large-font-size)",
            lineHeight: "var(--typography-label-large-line-height)",
            color: "var(--color-primary)",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}>
            {greeting} 👋
          </span>
          <h1 style={{ 
            fontSize: "var(--typography-headline-large-font-size)",
            lineHeight: "var(--typography-headline-large-line-height)",
            color: "var(--color-on-surface)",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            margin: 0
          }}>
            Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <p style={{ 
            fontSize: "var(--typography-title-medium-font-size)",
            lineHeight: "var(--typography-title-medium-line-height)",
            color: "var(--color-on-surface-variant)",
            fontWeight: "500"
          }}>
            Welcome back, {user?.businessName || user?.fullName || "Fashion Entrepreneur"}
          </p>
          <p style={{ 
            fontSize: "var(--typography-body-medium-font-size)",
            lineHeight: "var(--typography-body-medium-line-height)",
            color: "var(--color-on-surface-variant)",
            opacity: 0.7
          }}>
            Run your entire fashion business from one place.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
          gap: "var(--space-4)" 
        }}>
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} padding="md" className="hover-card" style={{ 
                display: "flex", 
                flexDirection: "row", 
                alignItems: "center",
                gap: "var(--space-4)",
                backgroundColor: "var(--color-surface-container-low)",
                border: "1px solid var(--color-outline-variant)"
              }}>
                <div style={{ 
                  height: "48px",
                  width: "48px",
                  minWidth: "48px",
                  borderRadius: "12px", 
                  backgroundColor: `color-mix(in srgb, ${stat.color}, transparent 92%)`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-0)" }}>
                  <span style={{ 
                    fontSize: "var(--typography-headline-small-font-size)",
                    lineHeight: "var(--typography-headline-small-line-height)",
                    fontWeight: "800",
                    color: "var(--color-on-surface)",
                    letterSpacing: "-0.01em"
                  }}>
                    {stat.value}
                  </span>
                  <span style={{ 
                    fontSize: "var(--typography-label-medium-font-size)",
                    lineHeight: "var(--typography-label-medium-line-height)",
                    color: "var(--color-on-surface-variant)",
                    fontWeight: "500"
                  }}>
                    {stat.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Main Content Layout */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", 
        gap: "var(--space-10)" 
      }}>
        {/* Quick Actions */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ 
            fontSize: "var(--typography-title-medium-font-size)",
            lineHeight: "var(--typography-title-medium-line-height)",
            fontWeight: "700",
            color: "var(--color-on-surface)",
            margin: 0
          }}>
            Quick Actions
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr", 
            gap: "var(--space-3)" 
          }}>
            <Link href="/orders/new" style={{ textDecoration: "none" }}>
              <Button variant="primary" style={{ width: "100%", height: "56px", fontSize: "var(--typography-label-large-font-size)" }}>
                <PlusCircle size={20} style={{ marginRight: "var(--space-2)" }} /> Create New Order
              </Button>
            </Link>
            <Link href="/customers/new" style={{ textDecoration: "none" }}>
              <Button variant="secondary" style={{ width: "100%", height: "56px", fontSize: "var(--typography-label-large-font-size)" }}>
                <UserPlus size={20} style={{ marginRight: "var(--space-2)" }} /> Add New Customer
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ 
            fontSize: "var(--typography-title-medium-font-size)",
            lineHeight: "var(--typography-title-medium-line-height)",
            fontWeight: "700",
            color: "var(--color-on-surface)",
            margin: 0
          }}>
            Recent Activity
          </h2>
          <Card padding="lg" style={{ 
            backgroundColor: "var(--color-surface-container-lowest)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed var(--color-outline-variant)",
            minHeight: "248px",
            textAlign: "center",
            gap: "var(--space-4)"
          }}>
            <div style={{ 
              height: "64px",
              width: "64px",
              borderRadius: "50%",
              backgroundColor: "var(--color-surface-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary)",
              opacity: 0.8
            }}>
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <h3 style={{ 
                fontSize: "var(--typography-title-small-font-size)",
                lineHeight: "var(--typography-title-small-line-height)",
                fontWeight: "600",
                color: "var(--color-on-surface)",
                margin: 0
              }}>
                You're all caught up!
              </h3>
              <p style={{ 
                fontSize: "var(--typography-body-small-font-size)",
                lineHeight: "var(--typography-body-small-line-height)",
                color: "var(--color-on-surface-variant)",
                maxWidth: "280px",
                margin: 0,
                opacity: 0.8
              }}>
                Customer orders and business updates will appear here as your business grows.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
