"use client";
import { useEffect, useRef } from "react";
import { WebGLShader } from "./WebGLShader";

import Link from "next/link";

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const spans = el.querySelectorAll("span");
    spans.forEach((span, i) => {
      span.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <WebGLShader />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div ref={textRef} className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="inline-block opacity-0 translate-y-8 font-display">Color</span>{" "}
            <span className="inline-block opacity-0 translate-y-8 font-display bg-gradient-to-r from-orange-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Your World
            </span>
            <br />
            <span className="inline-block opacity-0 translate-y-8 text-4xl md:text-5xl lg:text-6xl text-white/80 font-display-alt mt-4">
              One Page at a Time
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto opacity-0 translate-y-8 font-body"
            style={{ transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s" }}
          >
            Discover a world of creativity and relaxation with our coloring books. From playful kittens
            to serene ocean scenes — there&apos;s a page waiting for your colors.
          </p>
          <div
            className="flex items-center justify-center gap-4 pt-4 opacity-0 translate-y-8"
            style={{ transition: "opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s" }}
          >
            <Link
              href="/books"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold text-lg transition-all duration-200 hover:from-orange-400 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.97]"
            >
              Explore Books
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white/80 font-semibold text-lg transition-all duration-200 hover:bg-white/5 hover:border-white/30"
            >
              About Studio
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
