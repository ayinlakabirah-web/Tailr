type CardProps = {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  className?: string;
};

export function Card({ children, padding = "md", style, className }: CardProps) {
  const paddingValues: Record<string, string> = {
    sm: "12px",
    md: "16px",
    lg: "24px",
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--color-surface-container)",
        borderRadius: "12px",
        padding: paddingValues[padding],
        border: "1px solid var(--color-outline-variant)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
