import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '16px',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: 'var(--typography-display-medium-font-size)',
        lineHeight: 'var(--typography-display-medium-line-height)',
        fontWeight: 'var(--typography-display-medium-font-weight)',
        color: 'var(--color-primary)',
        marginBottom: '32px',
        paddingTop: 16,
        paddingBottom: 16
      }}>
        Welcome to Tailr
      </h1>
      <p style={{ 
        fontSize: 'var(--typography-body-large-font-size)',
        color: 'var(--color-on-surface-variant)',
        maxWidth: '600px',
        paddingTop: 16,
        paddingBottom: 16
      }}>
        The Operating System for Small Fashion Businesses is being initialized.
      </p>
      <Link href="/auth?mode=signup" style={{ marginTop: "24px", width: "100%", maxWidth: "400px" }}>
        <Button style={{ width: "100%" }}>Get Started</Button>
      </Link>
    </div>
  );
}
