import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karkoub Admin Dashboard | SDMoh Studio",
  description: "Admin portal for managing SDMoh Studio coloring book portfolio and inventory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function KarkoubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
