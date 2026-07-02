"use client";

import { Suspense, useState } from "react";
import { login, signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FashionIllustration } from "@/components/ui/fashion-illustration";
import { useRouter, useSearchParams } from "next/navigation";

type AuthMode = "login" | "signup";

function AuthForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", businessName: "", password: "", confirmPassword: "" });
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setFieldErrors({});
    setFormData({ fullName: "", email: "", businessName: "", password: "", confirmPassword: "" });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const { name, value } = e.target;
    if (name === "email" && value.trim()) {
      setFieldErrors(prev => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Enter a valid email address",
      }));
    } else if (name === "confirmPassword" && formData.password && value !== formData.password) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (name === "confirmPassword" && formData.password && value === formData.password) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
    } else if (name === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (name === "password" && formData.confirmPassword && value === formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
    } else {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (!value.trim()) {
      const messages: Record<string, string> = {
        businessName: "Business name is required",
        email: "Enter a valid email address",
        password: "Password must be at least 8 characters",
        confirmPassword: "Passwords do not match",
      };
      setFieldErrors(prev => ({ ...prev, [name]: messages[name] || "This field cannot be empty" }));
    } else if (name === "email" && !emailRegex.test(value)) {
      setFieldErrors(prev => ({ ...prev, [name]: "Enter a valid email address" }));
    } else if (name === "password" && value.length < 8) {
      setFieldErrors(prev => ({ ...prev, [name]: "Password must be at least 8 characters" }));
    } else if (name === "confirmPassword" && value !== formData.password) {
      setFieldErrors(prev => ({ ...prev, [name]: "Passwords do not match" }));
    } else {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const errors: Record<string, string> = {};
      if (!formData.email.trim()) errors.email = "Enter a valid email address";
      if (!formData.password.trim()) errors.password = "Password is required";
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setLoading(false);
        return;
      }
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error);
        setLoading(false);
      }
    } else {
      const errors: Record<string, string> = {};
      if (!formData.businessName.trim()) errors.businessName = "Business name is required";
      if (!formData.email.trim()) errors.email = "Enter a valid email address";
      else if (!emailRegex.test(formData.email)) errors.email = "Enter a valid email address";
      if (!formData.password.trim()) errors.password = "Password must be at least 8 characters";
      else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
      if (!formData.confirmPassword.trim() || formData.confirmPassword !== formData.password) errors.confirmPassword = "Passwords do not match";
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setLoading(false);
        return;
      }
      const result = await signUp({
        fullName: formData.businessName,
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        router.push("/onboarding");
      } else {
        setError(result.error);
        setLoading(false);
      }
    }
  }

  const heading = mode === "login" ? "Welcome back" : "Create your Tailr account";
  const description = mode === "login"
    ? "Log in to manage your fashion business"
    : "Manage customers, measurements, orders, payments, and deliveries\u2014all in one place.";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "var(--color-background)",
    }}>
      {/* Left column — illustration + branding (hidden on mobile) */}
      <div style={{
        display: "none",
        width: "50%",
        background: "linear-gradient(135deg, hsl(256, 34%, 48%) 0%, hsl(256, 34%, 60%) 100%)",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }} className="auth-illustration-column">
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
        }}>
          <FashionIllustration />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "380px", textAlign: "center" }}>
          <div style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#fff",
            letterSpacing: "2px",
            marginBottom: "16px",
          }}>
            TAILR
          </div>
          <p style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "rgba(255,255,255,0.85)",
            fontWeight: "400",
          }}>
            The operating system for small fashion businesses.
          </p>
        </div>
        <div style={{ position: "relative", zIndex: 1, marginTop: "32px", opacity: 0.6 }}>
          <FashionIllustration />
        </div>
      </div>

      {/* Right column — form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "440px",
        }}>
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

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "24px",
              lineHeight: "1.3",
              color: "var(--color-on-surface)",
              fontWeight: "700",
              marginBottom: "12px",
            }}>
              {heading}
            </h1>
            <p style={{
              fontSize: "14px",
              lineHeight: "1.5",
              color: "var(--color-on-surface-variant)",
            }}>
              {description}
            </p>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.password}
                showPasswordToggle
                labelRight={
                  <a href="/auth/forgot-password" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "14px" }}>
                    Forgot password?
                  </a>
                }
              />

              {error && (
                <div style={{
                  color: "var(--color-error)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  padding: "8px 12px",
                  backgroundColor: "var(--color-error-container)",
                  borderRadius: "8px",
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "8px" }}>
                <Button type="submit" isLoading={loading} style={{ width: "100%" }}>
                  Log In
                </Button>

                <div style={{
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "var(--color-on-surface-variant)",
                }}>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={switchMode}
                    style={{
                      color: "var(--color-primary)",
                      fontWeight: "500",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "inherit",
                      textDecoration: "underline",
                      textDecorationColor: "transparent",
                      transition: "text-decoration-color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.textDecorationColor = "var(--color-primary)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.textDecorationColor = "transparent"; }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <Input
                label="Business Name"
                name="businessName"
                placeholder="Jane's Fashion House"
                required
                autoFocus
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.businessName}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a secure password"
                required
                autoComplete="new-password"
                helperText="Must contain at least 8 characters."
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.password}
                showPasswordToggle
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
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
                  borderRadius: "8px",
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "8px" }}>
                <Button type="submit" isLoading={loading} style={{ width: "100%" }}>
                  Create Account
                </Button>

                <div style={{
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "var(--color-on-surface-variant)",
                }}>
                  Already have an account?{" "}
                  <button
                    onClick={switchMode}
                    style={{
                      color: "var(--color-primary)",
                      fontWeight: "500",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "inherit",
                      textDecoration: "underline",
                      textDecorationColor: "transparent",
                      transition: "text-decoration-color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.textDecorationColor = "var(--color-primary)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.textDecorationColor = "transparent"; }}
                  >
                    Log In
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          .auth-illustration-column {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
