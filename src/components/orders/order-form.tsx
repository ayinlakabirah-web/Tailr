"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createOrder } from "@/lib/actions/orders";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CustomerOption {
  id: string;
  fullName: string;
}

interface OrderFormProps {
  customers: CustomerOption[];
  preselectedCustomerId?: string;
}

export function OrderForm({ customers, preselectedCustomerId }: OrderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId ?? "",
    outfitType: "",
    quantity: "1",
    specialInstructions: "",
    deliveryDate: "",
    totalAmount: "",
    depositPaid: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.customerId) {
      setError("Please select a customer.");
      setIsLoading(false);
      return;
    }

    const result = await createOrder({
      customerId: formData.customerId,
      outfitType: formData.outfitType,
      quantity: parseInt(formData.quantity) || 1,
      specialInstructions: formData.specialInstructions || undefined,
      deliveryDate: formData.deliveryDate,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      depositPaid: parseFloat(formData.depositPaid) || 0,
    });

    if (result.success) {
      router.push(`/orders/${result.data.id}`);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
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

      <h1 style={{ fontSize: "var(--typography-headline-small-font-size)", fontWeight: "800", color: "var(--color-on-surface)", margin: 0 }}>
        New Order
      </h1>

      <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <label htmlFor="customerId" style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "var(--color-on-surface)", marginBottom: "8px" }}>
            Customer
          </label>
          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              height: "50px",
              padding: "12px 16px",
              fontSize: "16px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "var(--color-on-surface)",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName}</option>
            ))}
          </select>
        </div>

        <Input
          label="Outfit Type"
          name="outfitType"
          placeholder="e.g. Aso Ebi, Suit, Gown"
          value={formData.outfitType}
          onChange={handleChange}
          required
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="1"
          value={formData.quantity}
          onChange={handleChange}
        />

        <Input
          label="Delivery Date"
          name="deliveryDate"
          type="date"
          min={today}
          value={formData.deliveryDate}
          onChange={handleChange}
          required
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
          <Input
            label="Total Amount (₦)"
            name="totalAmount"
            type="number"
            placeholder="0.00"
            value={formData.totalAmount}
            onChange={handleChange}
            required
          />
          <Input
            label="Deposit Paid (₦)"
            name="depositPaid"
            type="number"
            placeholder="0.00"
            value={formData.depositPaid}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="specialInstructions" style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-on-surface)" }}>
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            placeholder="Fabric type, design details, etc."
            value={formData.specialInstructions}
            onChange={handleChange}
            rows={3}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "16px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "var(--color-on-surface)",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>
      </Card>

      {error && (
        <div style={{
          color: "var(--color-error)",
          fontSize: "14px",
          padding: "12px",
          backgroundColor: "color-mix(in srgb, var(--color-error), transparent 90%)",
          borderRadius: "8px",
        }}>
          {error}
        </div>
      )}

      <Button type="submit" isLoading={isLoading} style={{ width: "100%" }}>
        <Plus size={18} style={{ marginRight: "var(--space-2)" }} /> Create Order
      </Button>
    </form>
  );
}
