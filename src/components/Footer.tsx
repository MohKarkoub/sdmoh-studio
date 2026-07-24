import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/privacy-policy" className="text-white/30 hover:text-white/60 transition-colors font-body text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-white/30 hover:text-white/60 transition-colors font-body text-sm">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="text-white/30 hover:text-white/60 transition-colors font-body text-sm">
            Refund Policy
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
          <p className="text-white/40 font-body text-sm">
            &copy; {new Date().getFullYear()} SDMoh Studio. All rights reserved.
          </p>
          <p className="text-white/30 font-body text-sm">
            Coloring books for relaxation and creativity
          </p>
        </div>
      </div>
    </footer>
  );
}
