"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCustomer } from "@/lib/actions/customers";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteCustomerButtonProps {
  customerId: string;
  customerName: string;
}

export function DeleteCustomerButton({ customerId, customerName }: DeleteCustomerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${customerName}? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    const result = await deleteCustomer(customerId);

    if (result.success) {
      router.push("/customers");
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      isLoading={isLoading}
      style={{ color: "var(--color-error)" }}
    >
      <Trash2 size={16} style={{ marginRight: "var(--space-2)" }} /> Delete Customer
    </Button>
  );
}
