import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | SDMoh Studio — Coloring Book Creator",
  description: "Discover the story behind SDMoh Studio. We create bold and easy coloring books for adults, teens, and kids to spark joy, relaxation, and creativity.",
  openGraph: {
    title: "About Us | SDMoh Studio",
    description: "Discover the story behind SDMoh Studio. We create bold and easy coloring books for adults, teens, and kids to spark joy, relaxation, and creativity.",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
