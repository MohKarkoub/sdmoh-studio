"use client";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-colors mb-8 inline-block font-body">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl text-white mb-8 font-display">Terms of Service</h1>
        <div className="space-y-6 text-white/60 font-body text-base leading-relaxed">
          <p><strong className="text-white/80">Last updated:</strong> July 2026</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">1. Acceptance of Terms</h2>
          <p>By accessing and using the SDMoh Studio website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">2. Products</h2>
          <p>All coloring books are sold through Amazon KDP. Prices, availability, and delivery are subject to Amazon&apos;s terms and conditions. We do not process payments or handle shipping directly.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">3. Intellectual Property</h2>
          <p>All content on this website, including coloring book designs, text, and images, is the property of SDMoh Studio and is protected by copyright laws. You may not reproduce, distribute, or modify our content without permission.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">4. User Conduct</h2>
          <p>You agree not to use this website for any unlawful purpose or in violation of these terms. We reserve the right to restrict access to our site at any time.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">5. Limitation of Liability</h2>
          <p>SDMoh Studio is not liable for any damages arising from your use of this website or our products. Our coloring books are intended for personal enjoyment and relaxation.</p>
        </div>
      </div>
    </main>
  );
}
