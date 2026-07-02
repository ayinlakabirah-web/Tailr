"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, DollarSign, Truck } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Payments", href: "/payments", icon: DollarSign },
  { label: "Deliveries", href: "/deliveries", icon: Truck },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--color-surface-container-highest)",
        borderTop: "1px solid var(--color-outline-variant)",
        display: "flex",
        justifyContent: "space-around",
        padding: "var(--space-1) 0 calc(env(safe-area-inset-bottom, 4px) + var(--space-1))",
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-1)",
              padding: "var(--space-1) var(--space-3)",
              textDecoration: "none",
              color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              fontSize: "var(--typography-label-small-font-size)",
              lineHeight: "var(--typography-label-small-line-height)",
              fontWeight: isActive ? "700" : "500",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              minHeight: "56px",
              minWidth: "64px",
              position: "relative",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease",
              transform: isActive ? "translateY(-2px)" : "translateY(0)",
            }}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ 
              fontWeight: isActive ? "700" : "500",
              opacity: isActive ? 1 : 0.8 
            }}>
              {label}
            </span>
            {isActive && (
              <div style={{
                position: "absolute",
                bottom: "var(--space-1)",
                left: "50%",
                transform: "translateX(-50%)",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
