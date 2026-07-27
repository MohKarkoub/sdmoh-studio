import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SDMoh Studio",
  description: "Get in touch with SDMoh Studio. Have a question, feedback, or collaboration idea? Send us a message or visit our Amazon store.",
  openGraph: {
    title: "Contact Us | SDMoh Studio",
    description: "Get in touch with SDMoh Studio. Send us a message or visit our Amazon store.",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
