"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home", icon: "🎨" },
  { href: "/books", label: "Books", icon: "📖" },
  { href: "/about", label: "About", icon: "✨" },
  { href: "/contact", label: "Contact", icon: "✉️" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 via-purple-400/40 via-cyan-400/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-orange-400/60 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-500/20">
            <img src="/logo.png" alt="SDMoh Studio" className="h-full w-full object-cover" />
          </div>
          <span className="text-xl bg-gradient-to-r from-orange-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-display-alt group-hover:scale-105 transition-transform duration-300">
            SDMoh Studio
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm transition-all duration-300 group ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 inline-block">
                  {icon}
                </span>
                <span>{label}</span>
                {isActive && (
                  <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-orange-400 via-purple-400 to-cyan-400 shadow-lg shadow-purple-500/50" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
