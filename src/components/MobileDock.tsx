"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";

const items = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Books", href: "/books", icon: "📖" },
  { label: "About", href: "/about", icon: "✨" },
  { label: "Contact", href: "/contact", icon: "✉️" },
];

export default function MobileDock() {
  const router = useRouter();
  const pathname = usePathname();
  const lastY = useRef(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShow(y < lastY.current || y < 50);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      animate={{ y: show ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center md:hidden pb-3"
    >
      <nav className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-xl shadow-black/30">
        {items.map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-body transition-all duration-300 ${
                active
                  ? "text-white bg-white/15"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </motion.div>
  );
}
