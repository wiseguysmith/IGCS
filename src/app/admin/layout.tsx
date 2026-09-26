import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "IGCS administration",
  robots: { index: false, follow: false, noarchive: true },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
