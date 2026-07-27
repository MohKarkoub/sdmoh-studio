"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "@Karkoub8891#";
const RAW_BASE = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";
const GITHUB_API = "https://api.github.com/repos/MohKarkoub/sdmoh-studio/contents/public/books.json";

function rawUrl() { return RAW_BASE + "?t=" + Date.now(); }

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
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("karkoub_auth") === "true") {
      setAuthenticated(true);
    }
    const savedToken = (localStorage.getItem("github_token") || "").trim();
    setToken(savedToken);
  }, []);

  async function loadBooks() {
    setLoading(true);
    try {
      const savedToken = (localStorage.getItem("github_token") || "").trim();
      let data: BookData[];
      if (savedToken) {
        const res = await fetch(GITHUB_API, { headers: { Authorization: `token ${savedToken}` } });
        if (res.ok) {
          const json = await res.json();
          data = JSON.parse(decodeURIComponent(escape(atob(json.content.replace(/\s/g, '')))));
        } else {
          throw new Error("GitHub API error");
        }
      } else {
        throw new Error("No token");
      }
      setBooks(data);
      setOriginalBooks(data);
    } catch {
      try {
        const res = await fetch(rawUrl());
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
          setOriginalBooks(data);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  async function refreshFromAPI() {
    try {
      const t = (localStorage.getItem("github_token") || token).trim();
      if (t) {
        const res = await fetch(GITHUB_API, { headers: { Authorization: `token ${t}` } });
        if (res.ok) {
          const json = await res.json();
          const parsed = JSON.parse(decodeURIComponent(escape(atob(json.content.replace(/\s/g, '')))));
          setBooks(parsed);
          setOriginalBooks(parsed);
          return;
        }
      }
      const res = await fetch(rawUrl());
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
        setOriginalBooks(data);
      }
    } catch {}
  }

  useEffect(() => {
    if (!authenticated) return;
    loadBooks();
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

  function saveToken() {
    localStorage.setItem("github_token", token.trim());
    setToken(token.trim());
    setShowToken(false);
    loadBooks();
  }

  const hasChanges = JSON.stringify(books) !== JSON.stringify(originalBooks);

  function copyToClipboard(json: string) {
    navigator.clipboard.writeText(json);
  }

  const toggleHidden = useCallback((id: string) => {
    setBooks((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b));
      copyToClipboard(JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const deleteBook = useCallback((id: string) => {
    if (!confirm("Delete this book?")) return;
    setBooks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      copyToClipboard(JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const copyAll = useCallback(() => {
    const json = JSON.stringify(books, null, 2);
    copyToClipboard(json);
  }, [books]);

  const saveToGitHub = useCallback(async () => {
    if (!token) {
      setShowToken(true);
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/books/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          books: books,
          token,
          message: "Update books.json via Karkoub dashboard",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const json = JSON.stringify(books, null, 2);
        navigator.clipboard.writeText(json);
        throw new Error(data.error + " — JSON copied to clipboard.");
      }
      setSaveMsg({ ok: true, text: "Saved to GitHub! Changes are live." });
      setOriginalBooks([...books]);
      refreshFromAPI();
    } catch (err: any) {
      setSaveMsg({ ok: false, text: err.message || "Failed to save to GitHub" });
    } finally {
      setSaving(false);
    }
  }, [books, token]);

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
          <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold transition-all hover:from-orange-400 hover:to-purple-500">Login</button>
          <Link href="/karkoub" className="block text-center text-white/40 hover:text-white/70 text-sm font-body">&larr; Back</Link>
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
              <button onClick={() => setShowToken(!showToken)} className="px-3 py-2 rounded-xl border border-white/10 text-white/50 text-xs hover:bg-white/5 transition-all">
                {token ? "Token ✓" : "Set Token"}
              </button>
              <Link href="/karkoub" className="text-white/40 hover:text-white/70 text-sm font-body transition-colors">&larr; Back</Link>
            </div>
          </div>

          {showToken && (
            <div className="mb-6 p-4 rounded-xl bg-white/[0.06] border border-white/10">
              <label className="block text-white/60 text-xs mb-2 font-body">GitHub Token (repo scope)</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value.trim())}
                  placeholder="ghp_... or github_pat_..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50"
                />
                <button onClick={saveToken} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold">Save</button>
              </div>
              <p className="text-white/30 text-[11px] mt-2 font-body">
                Create at{" "}
                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">github.com/settings/tokens</a>
                {" "}(Fine-grained token with read/write access to sdmoh-studio repo)
              </p>
            </div>
          )}

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
                <Link href="/karkoub/add" className="inline-block mt-4 text-purple-400 hover:text-purple-300 underline text-sm font-body">Add a book</Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((book) => (
                <div key={book.id} className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20 transition-all">
                  <div className="w-14 h-[3.25rem] rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/[0.04]">
                    <img src={book.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/karkoub/manage/${book.id}`} className="text-white text-sm font-medium hover:text-purple-400 transition-colors line-clamp-1">{book.title}</Link>
                    <div className="flex items-center gap-3 mt-1">
                      {book.price && <span className="text-white/40 text-xs font-body">{book.price}</span>}
                      {book.asin && <><span className="text-white/20 text-xs">|</span><span className="text-white/30 text-xs font-body font-mono">{book.asin}</span></>}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${book.hidden ? "bg-red-500/15 text-red-400" : "bg-green-500/15 text-green-400"}`}>
                        {book.hidden ? "Hidden" : "Visible"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Link href={`/karkoub/manage/${book.id}`} className="px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/20 text-white/70 text-xs hover:bg-white/[0.12] transition-all">Edit</Link>
                    <button onClick={() => toggleHidden(book.id)} className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${book.hidden ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"}`}>
                      {book.hidden ? "Show" : "Hide"}
                    </button>
                    <button onClick={() => deleteBook(book.id)} className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {saveMsg && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl text-sm max-w-lg text-center ${
          saveMsg.ok ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-red-500/20 border border-red-500/40 text-red-400"
        }`}>
          {saveMsg.text}
        </div>
      )}

      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-5xl mx-auto px-6 pb-6">
            <div className="relative p-4 rounded-2xl bg-zinc-900/95 border border-yellow-500/30 backdrop-blur-xl shadow-2xl shadow-yellow-500/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <p className="text-yellow-400/80 text-sm font-body">Unsaved changes &mdash; modifications are local only</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveToGitHub}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save to GitHub"}
                  </button>
                  <a
                    href="https://github.com/MohKarkoub/sdmoh-studio/edit/main/public/books.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/[0.08] border border-white/20 text-white/70 text-sm hover:bg-white/[0.12] transition-all"
                  >
                    Manual Edit
                  </a>
                  <button onClick={copyAll} className="px-4 py-2 rounded-xl bg-white/[0.08] border border-white/20 text-white/70 text-sm hover:bg-white/[0.12] transition-all">
                    Copy JSON
                  </button>
                </div>
              </div>
              <p className="mt-2 text-yellow-500/40 text-[11px] font-body">
                {token ? "Save is instant. The site may take ~1 min to reflect changes (CDN cache)." : "Set a GitHub token above for one-click saving"}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
