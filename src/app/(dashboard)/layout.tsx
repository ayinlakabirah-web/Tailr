import { Navigation } from "@/components/ui/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ paddingBottom: "80px" }}> {/* Padding for sticky bottom nav */}
      {children}
      <Navigation />
    </div>
  );
}
