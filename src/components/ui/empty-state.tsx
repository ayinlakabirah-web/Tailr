"use client";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "var(--space-8) var(--space-4)",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "var(--typography-title-medium-font-size)",
          lineHeight: "var(--typography-title-medium-line-height)",
          color: "var(--color-on-surface)",
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: "var(--typography-body-small-font-size)",
            lineHeight: "var(--typography-body-small-line-height)",
            color: "var(--color-on-surface-variant)",
            maxWidth: "300px",
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
