"use client";
import BookCard from "@/components/BookCard";
import BookPreviewModal from "@/components/BookPreviewModal";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Book } from "@/data/books";
import { fetchBooks } from "@/data/books";

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks()
      .then((data) => { setBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl text-white mb-4 font-display">All Books</h1>
          <p className="text-white/50 max-w-xl mx-auto font-body text-lg md:text-xl">
            A collection of bold & easy coloring books for relaxation, creativity, and fun
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <BookCard book={book} onRead={setSelectedBook} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BookPreviewModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </main>
  );
}
