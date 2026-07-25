import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import dynamic from "next/dynamic";

const CursorGridBackground = dynamic(
  () => import("@/components/CursorGridBackground")
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SDMoh Studio — Coloring Books for Relaxation & Creativity",
  description: "Discover bold and easy coloring books for adults, teens, and kids. Relax, unwind, and color your world with SDMoh Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Black+And+White+Picture&family=Akronim&family=Gamja+Flower&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] overflow-x-hidden">
        <Header />
        <div className="flex-1 relative z-10 overflow-hidden">
          <CursorGridBackground />
          {children}
        </div>
        <Footer />
        <MobileDock />
      </body>
    </html>
  );
}
