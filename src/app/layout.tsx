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
  title: {
    default: "SDMoh Studio — Coloring Books for Relaxation & Creativity",
    template: "%s | SDMoh Studio",
  },
  description: "Discover bold and easy coloring books for adults, teens, and kids. Relax, unwind, and color your world with SDMoh Studio.",
  icons: { icon: "/logo.png" },
  keywords: ["coloring books", "bold and easy coloring book", "adult coloring books", "stress relief coloring", "cute cat coloring book", "SDMoh Studio", "KDP coloring books"],
  openGraph: {
    title: "SDMoh Studio — Coloring Books for Relaxation & Creativity",
    description: "Discover bold and easy coloring books for adults, teens, and kids. Relax, unwind, and color your world with SDMoh Studio.",
    siteName: "SDMoh Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDMoh Studio — Coloring Books for Relaxation & Creativity",
    description: "Discover bold and easy coloring books for adults, teens, and kids.",
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var cur=window.fetch;function g(){return cur}function s(v){cur=v}var p=typeof Window!=='undefined'&&Window.prototype;if(p){try{Object.defineProperty(p,'fetch',{get:g,set:s,configurable:true,enumerable:true})}catch(e){}}try{Object.defineProperty(window,'fetch',{get:g,set:s,configurable:true,enumerable:true})}catch(e){}}catch(e){}})()`,
          }}
        />
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
