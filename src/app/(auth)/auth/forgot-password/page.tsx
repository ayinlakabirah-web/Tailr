"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await requestPasswordReset({ email });
    if (result.success) {
      setSent(true);
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
      padding: "24px",
      backgroundColor: "var(--color-background)"
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo text */}
        <div style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "var(--color-primary)",
          letterSpacing: "1.5px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          TAILR
        </div>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "24px",
            lineHeight: "1.3",
            color: "var(--color-on-surface)",
            fontWeight: "700",
            marginBottom: "12px",
          }}>
            Reset your password
          </h1>
          <p style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "var(--color-on-surface-variant)"
          }}>
            {sent
              ? "If an account with that email exists, we've sent a reset link."
              : "Enter your email and we'll send you a reset link."
            }
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <Link
              href="/auth"
              style={{
                color: "var(--color-primary)",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />

            {error && (
              <div style={{
                color: "var(--color-error)",
                fontSize: "13px",
                lineHeight: "1.5",
                padding: "8px 12px",
                backgroundColor: "var(--color-error-container)",
                borderRadius: "8px"
              }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: "8px" }}>
              <Button type="submit" isLoading={loading} style={{ width: "100%" }}>
                Send Reset Link
              </Button>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link
                href="/auth"
                style={{
                  color: "var(--color-primary)",
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
