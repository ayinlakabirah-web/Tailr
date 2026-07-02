"use client";

import { useState } from "react";

type ButtonProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  children,
  isLoading,
  size = "md",
  variant = "primary",
  type,
  style,
  onClick,
  disabled,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.6 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { height: "40px", padding: "8px 16px", fontSize: "14px", lineHeight: "1.5" },
    md: { height: "50px", padding: "12px 24px", fontSize: "16px", lineHeight: "1.5" },
    lg: { height: "56px", padding: "16px 32px", fontSize: "18px", lineHeight: "1.5" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { 
      backgroundColor: "var(--color-primary)", 
      color: "var(--color-on-primary)",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    },
    secondary: { 
      backgroundColor: "var(--color-secondary-container)", 
      color: "var(--color-on-secondary-container)",
      border: "1px solid var(--color-outline-variant)"
    },
    ghost: { 
      backgroundColor: "transparent", 
      color: "var(--color-primary)" 
    },
  };

  return (
    <button
      type={type}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
        opacity: disabled || isLoading ? 0.6 : 1,
        backgroundColor: hovered && !disabled && !isLoading
          ? variant === "primary" 
            ? "hsl(256, 34%, 44%)" // Slightly darker primary
            : "var(--color-surface-container-high)" // Neutral hover for secondary/ghost
          : variantStyles[variant].backgroundColor,
        transform: active && !disabled && !isLoading ? "scale(0.97)" : hovered && !disabled && !isLoading ? "scale(1.01)" : "scale(1)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {isLoading ? "..." : children}
    </button>
  );
}
