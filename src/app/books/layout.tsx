import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Coloring Books | SDMoh Studio",
  description: "Browse our complete collection of bold and easy coloring books. From cute cats and cozy animals to calming bedtime and ocean scenes, find your next coloring adventure.",
  openGraph: {
    title: "All Coloring Books | SDMoh Studio",
    description: "Browse our complete collection of bold and easy coloring books for stress relief, relaxation, and fun.",
    type: "website",
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
