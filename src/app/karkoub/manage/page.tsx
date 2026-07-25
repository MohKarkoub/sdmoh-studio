"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "@Karkoub8891#";
const BOOKS_JSON_URL = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";

interface BookData {
  id: string;
  title: string;
  asin: string;
  coverImage: string;
  price: string;
  hidden?: boolean;
}

export default function ManageBooksPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [books, setBooks] = useState<BookData[]>([]);
  const [originalBooks, setOriginalBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("karkoub_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch(BOOKS_JSON_URL)
      .then((r) => r.json())
      .then((data) => { setBooks(data); setOriginalBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("karkoub_auth", "true");
      setError("");
    } else {
      setError("Wrong password");
    }
  }

  const hasChanges = JSON.stringify(books) !== JSON.stringify(originalBooks);

  function copyAndNotify(json: string) {
    navigator.clipboard.writeText(json);
  }

  const toggleHidden = useCallback((id: string) => {
    setBooks((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b));
      const json = JSON.stringify(updated, null, 2);
      copyAndNotify(json);
      return updated;
    });
  }, []);

  const deleteBook = useCallback((id: string) => {
    if (!confirm("Delete this book?")) return;
    setBooks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      const json = JSON.stringify(updated, null, 2);
      copyAndNotify(json);
      return updated;
    });
  }, []);

  const copyAll = useCallback(() => {
    const json = JSON.stringify(books, null, 2);
    copyAndNotify(json);
  }, [books]);

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.asin?.toLowerCase().includes(search.toLowerCase())
  );

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl text-white font-display text-center mb-6">Karkoub</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold transition-all hover:from-orange-400 hover:to-purple-500"
          >
            Login
          </button>
          <Link href="/karkoub" className="block text-center text-white/40 hover:text-white/70 text-sm font-body">
            &larr; Back
          </Link>
        </form>
      </main>
    );
  }

  const visibleCount = books.filter((b) => !b.hidden).length;

  return (
    <main className="min-h-screen pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl text-white font-display">Manage Books</h1>
              <p className="text-white/40 text-sm mt-1 font-body">{books.length} books &middot; {visibleCount} visible &middot; {books.length - visibleCount} hidden</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={copyAll}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold transition-all hover:from-orange-400 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
              >
                Copy All JSON
              </button>
              <Link href="/karkoub" className="text-white/40 hover:text-white/70 text-sm font-body transition-colors">
                &larr; Back
              </Link>
            </div>
          </div>

          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books by title or ASIN..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg font-body">{books.length === 0 ? "No books found" : "No books match your search"}</p>
              {books.length === 0 && (
                <Link href="/karkoub/add" className="inline-block mt-4 text-purple-400 hover:text-purple-300 underline text-sm font-body">
                  Add a book
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((book) => (
                <div
                  key={book.id}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <div className="w-14 h-[3.25rem] rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/[0.04]">
                    <img
                      src={book.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/karkoub/manage/${book.id}`}
                      className="text-white text-sm font-medium hover:text-purple-400 transition-colors line-clamp-1"
                    >
                      {book.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      {book.price && <span className="text-white/40 text-xs font-body">{book.price}</span>}
                      {book.asin && (
                        <>
                          <span className="text-white/20 text-xs">|</span>
                          <span className="text-white/30 text-xs font-body font-mono">{book.asin}</span>
                        </>
                      )}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${book.hidden ? "bg-red-500/15 text-red-400" : "bg-green-500/15 text-green-400"}`}>
                        {book.hidden ? "Hidden" : "Visible"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/karkoub/manage/${book.id}`}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/20 text-white/70 text-xs hover:bg-white/[0.12] transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => toggleHidden(book.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        book.hidden
                          ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                          : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                      }`}
                    >
                      {book.hidden ? "Show" : "Hide"}
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-5xl mx-auto px-6 pb-6">
            <div className="relative p-4 rounded-2xl bg-zinc-900/95 border border-yellow-500/30 backdrop-blur-xl shadow-2xl shadow-yellow-500/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <p className="text-yellow-400/80 text-sm font-body">
                    Unsaved changes &mdash; modifications are local only
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/MohKarkoub/sdmoh-studio/edit/main/public/books.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/25 transition-all"
                  >
                    Open GitHub
                  </a>
                  <button
                    onClick={copyAll}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold hover:from-orange-400 hover:to-purple-500 transition-all"
                  >
                    Copy JSON &amp; Save
                  </button>
                </div>
              </div>
              <p className="mt-2 text-yellow-500/40 text-[11px] font-body">
                After copying, go to GitHub, select all, and paste to replace the content
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
