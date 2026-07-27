"use client";
import type { Book } from "@/data/books";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const springValues = { damping: 30, stiffness: 100, mass: 2 };

interface BookCardProps {
  book: Book;
  onRead: (book: Book) => void;
}

export default function BookCard({ book, onRead }: BookCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -14;
    const rotationY = (offsetX / (rect.width / 2)) * 14;
    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(1.05);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure group relative h-full"
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <motion.div
        className="tilted-card-inner relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden w-full h-full flex flex-col"
        style={{ rotateX, rotateY, scale }}
      >
        <div className="aspect-[0.75] relative overflow-hidden shrink-0">
          <img
            src={book.coverImage}
            alt={book.title}
            className="tilted-card-img w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white/90 line-clamp-2 leading-relaxed mb-2 font-body text-base">
            {book.title}
          </h3>
          <div className="flex-1" />
          <div className="flex items-center justify-between mb-3">
            {book.price && (
              <span className="text-white/60 font-body text-sm">{book.price}</span>
            )}
            <button
              onClick={() => onRead(book)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/70 text-xs font-medium transition-all duration-200 hover:bg-white/5 hover:border-white/20 hover:text-white"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read
            </button>
          </div>
          <a
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold transition-all duration-200 hover:from-orange-400 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.97]"
          >
            Buy on Amazon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </motion.div>
    </figure>
  );
}
