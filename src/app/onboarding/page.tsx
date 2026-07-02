"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/lib/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const STEPS = [
  { label: "Welcome", description: "Let's get your business set up" },
  { label: "Customer", description: "Add your first customer" },
  { label: "Ready", description: "You're all set" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ customerName: "", customerPhone: "", customerEmail: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleFinish() {
    const errors: Record<string, string> = {};
    if (!formData.customerName.trim()) errors.customerName = "This field cannot be empty";
    if (!formData.customerPhone.trim()) errors.customerPhone = "This field cannot be empty";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await createCustomer({
      fullName: formData.customerName.trim(),
      phoneNumber: formData.customerPhone.trim(),
      email: formData.customerEmail.trim() || undefined,
    });
    if (result.success) {
      setStep(2);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "var(--space-4)",
      backgroundColor: "var(--color-background)"
    }}>
      <Card style={{ width: "100%", maxWidth: "480px", border: "none", backgroundColor: "var(--color-background)" }}>
        {/* Progress indicator */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--typography-label-small-font-size)",
                lineHeight: "var(--typography-label-small-line-height)",
                fontWeight: "600",
                backgroundColor: i <= step ? "var(--color-primary)" : "var(--color-surface-container-high)",
                color: i <= step ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                transition: "background-color 0.3s, color 0.3s",
              }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{
            fontSize: "var(--typography-headline-small-font-size)",
            lineHeight: "var(--typography-headline-small-line-height)",
            color: "var(--color-primary)",
            marginBottom: "8px",
          }}>
            {step === 0 && "Welcome to Tailr"}
            {step === 1 && "Add your first customer"}
            {step === 2 && "You're all set!"}
          </h1>
          <p style={{
            fontSize: "var(--typography-body-small-font-size)",
            lineHeight: "var(--typography-body-small-line-height)",
            color: "var(--color-on-surface-variant)",
          }}>
            {step === 0 && "We'll help you get started in just a few steps."}
            {step === 1 && "Enter the details of your first customer to get started."}
            {step === 2 && "Your business is ready to go. Start managing orders, payments, and deliveries."}
          </p>
        </div>

        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <div style={{
              fontSize: "var(--typography-body-medium-font-size)",
              lineHeight: "var(--typography-body-medium-line-height)",
              color: "var(--color-on-surface)",
              textAlign: "center",
      padding: "16px",
              backgroundColor: "var(--color-surface-container-high)",
              borderRadius: "var(--space-2)",
              width: "100%",
              boxSizing: "border-box",
            }}>
              Your business is ready to go. Let's add your first customer so you can start tracking orders.
            </div>
            <Button onClick={() => setStep(1)} style={{ marginTop: "24px" }}>
              Get Started
            </Button>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
              label="Customer Full Name"
              name="customerName"
              placeholder="e.g. Grace Adeyemi"
              required
              autoFocus
              value={formData.customerName}
              onChange={handleChange}
              error={fieldErrors.customerName}
            />
            <Input
              label="Phone Number"
              name="customerPhone"
              type="tel"
              placeholder="e.g. +234 800 000 0000"
              required
              value={formData.customerPhone}
              onChange={handleChange}
              error={fieldErrors.customerPhone}
            />
            <Input
              label="Email (optional)"
              name="customerEmail"
              type="email"
              placeholder="grace@example.com"
              value={formData.customerEmail}
              onChange={handleChange}
            />

            {error && (
              <div style={{
                color: "var(--color-error)",
                fontSize: "var(--typography-label-small-font-size)",
                lineHeight: "var(--typography-label-small-line-height)",
                padding: "8px 12px",
                backgroundColor: "var(--color-error-container)",
              borderRadius: "8px",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
              <Button type="button" variant="ghost" onClick={() => setStep(0)} style={{ flex: 1 }}>
                Back
              </Button>
              <Button onClick={handleFinish} isLoading={loading} style={{ flex: 1 }}>
                Save & Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "var(--color-primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "var(--color-on-primary-container)",
            }}>
              ✓
            </div>
            <Button onClick={() => router.push("/dashboard")} style={{ marginTop: "8px" }}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
