"use client";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-colors mb-8 inline-block font-body">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl text-white mb-8 font-display">Refund Policy</h1>
        <div className="space-y-6 text-white/60 font-body text-base leading-relaxed">
          <p><strong className="text-white/80">Last updated:</strong> July 2026</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">1. Digital Products</h2>
          <p>Our coloring books are physical products sold through Amazon KDP. All purchases, refunds, and returns are handled entirely by Amazon according to their refund policy.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">2. Amazon KDP Purchases</h2>
          <p>If you are not satisfied with your purchase, please refer to Amazon&apos;s return and refund policy. Typically, Amazon allows returns within 30 days of delivery for physical books in new condition.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">3. Contact Us</h2>
          <p>If you have any issues with your order, feel free to contact us and we will do our best to assist you in resolving the matter.</p>
        </div>
      </div>
    </main>
  );
}
