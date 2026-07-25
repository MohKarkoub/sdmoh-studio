"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Book } from "@/data/books";

const ADMIN_PASSWORD = "@Karkoub8891#";
const BOOKS_JSON_URL = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";

interface EditableBook extends Book {
  _deleted?: boolean;
}

export default function ManageBooksPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [books, setBooks] = useState<EditableBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Book>>({});

  useEffect(() => {
    if (sessionStorage.getItem("karkoub_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch(BOOKS_JSON_URL)
      .then((r) => r.json())
      .then((data) => { setBooks(data); setLoading(false); })
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

  function toggleHidden(id: string) {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b))
    );
  }

  function deleteBook(id: string) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    setEditForm({ ...book });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  function saveEdit(id: string) {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...editForm } : b))
    );
    setEditingId(null);
    setEditForm({});
  }

  function copyAll() {
    const clean = books.map(({ _deleted, ...rest }) => rest);
    const json = JSON.stringify(clean, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function editField(field: string, value: string | boolean) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

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
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-white font-display">Karkoub / Manage</h1>
            <p className="text-white/40 text-sm mt-1">{books.length} books ({visibleCount} visible)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyAll}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold transition-all hover:from-orange-400 hover:to-purple-500"
            >
              {copied ? "Copied!" : "Copy All JSON"}
            </button>
            <Link href="/karkoub" className="text-white/40 hover:text-white/70 text-sm font-body">
              &larr; Back
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No books found</p>
            <Link href="/karkoub/add" className="inline-block mt-4 text-purple-400 hover:text-purple-300 underline text-sm">
              Add a book
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-xl bg-white/[0.06] border border-white/10 overflow-hidden"
              >
                {editingId === book.id ? (
                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-white/40 text-xs mb-1">Title</label>
                        <input value={editForm.title || ""} onChange={(e) => editField("title", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">ASIN</label>
                        <input value={editForm.asin || ""} onChange={(e) => editField("asin", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Price</label>
                        <input value={editForm.price || ""} onChange={(e) => editField("price", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">ISBN</label>
                        <input value={editForm.isbn || ""} onChange={(e) => editField("isbn", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Amazon Link</label>
                        <input value={editForm.amazonLink || ""} onChange={(e) => editField("amazonLink", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/40 text-xs mb-1">Cover Image URL</label>
                        <input value={editForm.coverImage || ""} onChange={(e) => editField("coverImage", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/40 text-xs mb-1">Description</label>
                        <textarea value={editForm.description || ""} onChange={(e) => editField("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button onClick={() => saveEdit(book.id)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold">Save</button>
                      <button onClick={cancelEdit} className="px-4 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-white/[0.04]">
                      <img src={book.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">{book.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {book.price && <span className="text-white/40 text-xs">{book.price}</span>}
                        <span className="text-white/20 text-xs">|</span>
                        <span className="text-white/30 text-xs">{book.asin || "—"}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${book.hidden ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {book.hidden ? "Hidden" : "Visible"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(book)} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs hover:bg-white/5">Edit</button>
                      <button onClick={() => toggleHidden(book.id)} className={`px-3 py-1.5 rounded-lg border text-xs ${book.hidden ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"}`}>
                        {book.hidden ? "Show" : "Hide"}
                      </button>
                      <button onClick={() => deleteBook(book.id)} className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {copied && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 text-sm text-center">
            Full JSON copied! Go to{" "}
            <a href="https://github.com/MohKarkoub/sdmoh-studio/edit/main/public/books.json" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">
              GitHub books.json
            </a>{" "}
            and paste the entire array.
          </div>
        )}
      </div>
    </main>
  );
}
