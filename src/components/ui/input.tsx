"use client";

import { useState } from "react";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  helperText?: string;
  labelRight?: React.ReactNode;
  error?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  showPasswordToggle?: boolean;
  min?: string;
};

export function Input({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
  helperText,
  labelRight,
  error,
  defaultValue,
  value,
  onChange,
  onBlur,
  autoFocus,
  showPasswordToggle,
  min,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputType = showPasswordToggle && passwordVisible ? "text" : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <label
          htmlFor={name}
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "var(--color-on-surface)",
            fontWeight: "500",
          }}
        >
          {label}
        </label>
        {labelRight && (
          <span style={{
            fontSize: "14px",
            lineHeight: "1.5",
            whiteSpace: "nowrap",
          }}>
            {labelRight}
          </span>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          min={min}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          style={{
            width: "100%",
            height: "50px",
            padding: showPasswordToggle ? "12px 44px 12px 16px" : "12px 16px",
            fontSize: "16px",
            lineHeight: "1.5",
            border: `1px solid ${focused ? "var(--color-primary)" : "#D1D5DB"}`,
            borderRadius: "8px",
            backgroundColor: "#fff",
            color: "var(--color-on-surface)",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            ...(focused && {
              boxShadow: "0 0 0 3px rgba(99, 74, 173, 0.15)",
            }),
          }}
        />
        {showPasswordToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setPasswordVisible(prev => !prev)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#9CA3AF",
              fontSize: "16px",
              lineHeight: 1,
            }}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {helperText && !error && (
        <span
          style={{
            fontSize: "13px",
            lineHeight: "1.5",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {helperText}
        </span>
      )}
      {error && (
        <span
          style={{
            fontSize: "13px",
            lineHeight: "1.5",
            color: "var(--color-error)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
