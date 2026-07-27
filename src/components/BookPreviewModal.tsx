"use client";
import type { Book } from "@/data/books";
import { useEffect } from "react";
import ShareButtons from "./ShareButtons";

interface BookPreviewModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookPreviewModal({ book, onClose }: BookPreviewModalProps) {
  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [book]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          <div className="w-full md:w-80 p-6 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto space-y-6">
            <div>
              <div className="aspect-[0.75] rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{book.title}</h2>
              <p className="text-white/50 text-sm mb-4 line-clamp-4">{book.description}</p>
              <div className="space-y-2 text-sm">
                {book.printLength && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Print length</span>
                    <span className="text-white/80">{book.printLength}</span>
                  </div>
                )}
                {book.language && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Language</span>
                    <span className="text-white/80">{book.language}</span>
                  </div>
                )}
                {book.publicationDate && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Publication date</span>
                    <span className="text-white/80">{book.publicationDate}</span>
                  </div>
                )}
                {book.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Dimensions</span>
                    <span className="text-white/80">{book.dimensions}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="text-white/40">ISBN-13</span>
                    <span className="text-white/80">{book.isbn}</span>
                  </div>
                )}
              </div>
              <a
                href={book.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold transition-all duration-200 hover:from-orange-400 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Buy on Amazon
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="pt-4 border-t border-white/10">
              <ShareButtons
                title={book.title}
                description={book.description}
                imageUrl={book.coverImage}
                url={book.amazonLink}
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Preview Pages</h3>
            {book.contentPages.length > 0 ? (
              <div className="space-y-6">
                {book.contentPages.map((page, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/30">
                    <img
                      src={page}
                      alt={`${book.title} - Page ${i + 1}`}
                      className="w-full rounded-lg"
                    />
                    <div className="p-3 bg-zinc-900/90 border-t border-white/10">
                      <ShareButtons
                        title={`${book.title} - Page ${i + 1}`}
                        description={`Coloring page preview from ${book.title}`}
                        imageUrl={page}
                        url={book.amazonLink}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/30">
                No preview available yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
