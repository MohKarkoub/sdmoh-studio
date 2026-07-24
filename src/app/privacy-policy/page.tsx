"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-colors mb-8 inline-block font-body">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl text-white mb-8 font-display">Privacy Policy</h1>
        <div className="space-y-6 text-white/60 font-body text-base leading-relaxed">
          <p><strong className="text-white/80">Last updated:</strong> July 2026</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">1. Information We Collect</h2>
          <p>When you visit SDMoh Studio, we may collect personal information that you voluntarily provide to us, such as your name and email address when you contact us or sign up for our newsletter.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to respond to your inquiries, improve our website and products, and send occasional updates about new coloring book releases if you have opted in.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">3. Third-Party Services</h2>
          <p>Our coloring books are sold through Amazon KDP. When you purchase a book, your transaction is handled entirely by Amazon. We do not receive, store, or process any payment information on our site.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">4. Cookies</h2>
          <p>We may use basic cookies to improve your browsing experience. You can disable cookies in your browser settings at any time.</p>

          <h2 className="text-2xl text-white/80 font-display-alt mt-8">5. Contact</h2>
          <p>If you have any questions about this policy, please reach out through our contact page.</p>
        </div>
      </div>
    </main>
  );
}
