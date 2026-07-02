"use client";

import { useState } from "react";
import { createCustomer, updateCustomer } from "@/lib/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
  initialData?: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
    address?: string | null;
  };
}

export function CustomerForm({ initialData }: CustomerFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
    };

    const result = initialData 
      ? await updateCustomer(initialData.id, data)
      : await createCustomer(data);

    if (result.success) {
      router.push("/customers");
    } else {
      setError(result.error ?? null);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Input 
        label="Full Name" 
        name="fullName" 
        defaultValue={initialData?.fullName} 
        required 
        placeholder="e.g. John Smith"
      />
      <Input 
        label="Phone Number" 
        name="phoneNumber" 
        defaultValue={initialData?.phoneNumber} 
        required 
        placeholder="e.g. 08012345678"
      />
      <Input 
        label="Email (Optional)" 
        name="email" 
        type="email" 
        defaultValue={initialData?.email || ""} 
        placeholder="john@example.com"
      />
      <Input 
        label="Address (Optional)" 
        name="address" 
        defaultValue={initialData?.address || ""} 
        placeholder="e.g. 123 Fashion Blvd"
      />

      {error && (
        <div style={{ 
          color: "var(--color-error)", 
          fontSize: "var(--typography-label-small-font-size)",
          lineHeight: "var(--typography-label-small-line-height)",
          padding: "var(--space-2)",
          backgroundColor: "var(--color-error-container)",
          borderRadius: "var(--space-2)"
        }}>
          {error}
        </div>
      )}

      <Button type="submit" isLoading={loading}>
        {initialData ? "Update Customer" : "Add Customer"}
      </Button>
    </form>
  );
}
