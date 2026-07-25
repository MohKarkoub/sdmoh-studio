"use client";
import HeroSection from "@/components/HeroSection";
import LaserFlow from "@/components/LaserFlow";
import BookCard from "@/components/BookCard";
import CircularGallery from "@/components/CircularGallery";
import BookPreviewModal from "@/components/BookPreviewModal";
import ScrollFloat from "@/components/ScrollFloat";
import ScrollReveal from "@/components/ScrollReveal";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Book } from "@/data/books";
import { fetchBooks } from "@/data/books";

const galleryItems = [
  { image: "https://images.unsplash.com/photo-1734680878306-c8b076d5fde2?w=800&q=80", text: "Coloring Book" },
  { image: "https://images.unsplash.com/photo-1761034036989-24640be78e90?w=800&q=80", text: "Mandala Art" },
  { image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80", text: "Colored Pencils" },
  { image: "https://images.unsplash.com/photo-1761034036962-22e04edc8b22?w=800&q=80", text: "Coloring Process" },
  { image: "https://images.unsplash.com/photo-1521667427778-cbb9f8622ac4?w=800&q=80", text: "Art Supplies" },
  { image: "https://images.unsplash.com/photo-1611837897728-e57656a5bed8?w=800&q=80", text: "Creative Design" },
  { image: "https://images.unsplash.com/photo-1776267073554-ae9a46da454f?w=800&q=80", text: "Crayons & Pages" },
  { image: "https://images.unsplash.com/photo-1731147391367-e5dd329d9b44?w=800&q=80", text: "Pencil Colors" },
];

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks()
      .then((data) => { setBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="overflow-hidden pb-24">
      <HeroSection />

      <div className="relative w-full overflow-hidden" style={{ height: "500px", marginTop: "-275px", paddingTop: 50 }}>
        <LaserFlow
          horizontalBeamOffset={0.0}
          verticalBeamOffset={0.0}
          color="#04AFFF"
          flowSpeed={0.35}
          fogIntensity={0.5}
          fogScale={-0.6}
          wispIntensity={3.0}
          horizontalSizing={1.75}
          verticalSizing={1.25}
        />
      </div>

      <section className="relative z-10 pb-24 px-6" style={{ marginTop: "-100px" }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4 font-display">Featured Books</h2>
            <p className="text-white/50 max-w-xl mx-auto font-body text-lg md:text-xl">
              Bold and easy designs for everyone — from cozy animals to playful cats and relaxing ocean scenes
            </p>
          </ScrollReveal>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ScrollReveal direction="up" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {books.slice(0, 3).map((book, i) => (
                  <BookCard key={book.id} book={book} onRead={setSelectedBook} />
                ))}
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal direction="up" delay={0.4} className="text-center mt-12">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 text-sm font-medium transition-all duration-200 hover:bg-white/5 hover:border-white/20"
            >
              View All Books
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 pb-24">
        <div className="text-center mb-8 px-6">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="mb-4"
            textClassName="font-display text-5xl md:text-6xl lg:text-7xl"
          >
            Explore Our World
          </ScrollFloat>
          <ScrollReveal direction="fade" delay={0.3}>
            <p className="text-white/50 max-w-2xl mx-auto font-body text-lg md:text-xl">
              From black & white outlines to vibrant colored pages — discover the magic of coloring
            </p>
          </ScrollReveal>
        </div>
        <div style={{ height: "500px", position: "relative", marginTop: -70 }}>
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      </section>

      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="mb-6"
            textClassName="font-display text-5xl md:text-6xl lg:text-7xl"
          >
            About SDMoh Studio
          </ScrollFloat>
          <ScrollReveal direction="fade" delay={0.2}>
            <p className="text-white/50 text-xl md:text-2xl leading-relaxed mb-8 font-body">
              We create bold, easy, and fun coloring books for adults and kids alike. Our designs focus on relaxation, stress relief, and pure creative joy. From adorable cats to underwater adventures, every page is a new journey.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <ScrollReveal direction="left" delay={0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.12] border border-white/20">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-white mb-2 font-display-alt text-2xl">50+ Designs</h3>
                <p className="text-white/40 font-body text-base">Each book packed with unique, bold, and easy coloring pages</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-6 rounded-2xl bg-white/[0.12] border border-white/20">
                <div className="text-4xl mb-4">😌</div>
                <h3 className="text-white mb-2 font-display-alt text-2xl">Stress Relief</h3>
                <p className="text-white/40 font-body text-base">Relaxing designs perfect for unwinding after a long day</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.3}>
              <div className="p-6 rounded-2xl bg-white/[0.12] border border-white/20">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-white mb-2 font-display-alt text-2xl">Perfect Gift</h3>
                <p className="text-white/40 font-body text-base">Great gift for cat lovers, artists, and coloring fans</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <BookPreviewModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </main>
  );
}
