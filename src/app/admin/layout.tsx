import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - CyberCity",
  description: "Manage laptop inventory and price ranges",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
