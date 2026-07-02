"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!password.trim()) errors.password = "Password must be at least 8 characters";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!confirmPassword.trim() || confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const result = await resetPassword({ token, password });
    if (result.success) {
      setSuccess(true);
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
            marginBottom: "12px"
          }}>
            {success ? "Password reset" : "Set new password"}
          </h1>
          <p style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "var(--color-on-surface-variant)"
          }}>
            {success
              ? "Your password has been updated."
              : "Enter your new password below."
            }
          </p>
        </div>

        {success ? (
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
              label="New Password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              required
              autoComplete="new-password"
              helperText="Must contain at least 8 characters."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              showPasswordToggle
              autoFocus
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
              showPasswordToggle
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
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
