"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ADMIN_PASSWORD = "@Karkoub8891#";
const GITHUB_API = "https://api.github.com/repos/MohKarkoub/sdmoh-studio/contents/public/books.json";

interface EditForm {
  title: string;
  asin: string;
  amazonLink: string;
  coverImage: string;
  description: string;
  printLength: string;
  language: string;
  publicationDate: string;
  dimensions: string;
  isbn: string;
  price: string;
  hidden: boolean;
  contentPages: string[];
}

export default function EditBookPage() {
  const params = useParams();
  const id = params.id as string;

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<EditForm | null>(null);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("karkoub_auth") === "true") {
      setAuthenticated(true);
    }
    const savedToken = sessionStorage.getItem("github_token") || "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!authenticated || !id) return;
    loadBook();
  }, [authenticated, id]);

  function loadBook() {
    fetch(GITHUB_API, { headers: { Authorization: `token ${token}` } })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        const content = decodeURIComponent(escape(atob(data.content)));
        const books = JSON.parse(content);
        const book = books.find((b: any) => b.id === id);
        if (!book) { setNotFound(true); setLoading(false); return; }
        setForm({
          title: book.title || "",
          asin: book.asin || "",
          amazonLink: book.amazonLink || "",
          coverImage: book.coverImage || "",
          description: book.description || "",
          printLength: book.printLength || "",
          language: book.language || "",
          publicationDate: book.publicationDate || "",
          dimensions: book.dimensions || "",
          isbn: book.isbn || "",
          price: book.price || "",
          hidden: book.hidden || false,
          contentPages: book.contentPages || [],
        });
        setLoading(false);
      })
      .catch(() => {
        fetch("https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json?t=" + Date.now())
          .then((r) => r.json())
          .then((books) => {
            const book = books.find((b: any) => b.id === id);
            if (!book) { setNotFound(true); setLoading(false); return; }
            setForm({
              title: book.title || "",
              asin: book.asin || "",
              amazonLink: book.amazonLink || "",
              coverImage: book.coverImage || "",
              description: book.description || "",
              printLength: book.printLength || "",
              language: book.language || "",
              publicationDate: book.publicationDate || "",
              dimensions: book.dimensions || "",
              isbn: book.isbn || "",
              price: book.price || "",
              hidden: book.hidden || false,
              contentPages: book.contentPages || [],
            });
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }

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
    sessionStorage.setItem("github_token", token);
    setShowToken(false);
  }

  function updateField(field: keyof EditForm, value: string | boolean | string[]) {
    if (!form) return;
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function saveToGitHub() {
    if (!form || !form.title || !form.amazonLink) return;
    if (!token) { setShowToken(true); return; }
    setSaving(true);
    setSaveMsg(null);
    try {
      const shaRes = await fetch(GITHUB_API, {
        headers: { Authorization: `token ${token}` },
      });
      if (!shaRes.ok) { const e = await shaRes.json().catch(() => ({})); throw new Error(e.message || `API error: ${shaRes.status}`); }
      const shaData = await shaRes.json();
      const sha = shaData.sha;
      const currentContent = decodeURIComponent(escape(atob(shaData.content)));
      const books = JSON.parse(currentContent);
      const idx = books.findIndex((b: any) => b.id === id);
      if (idx === -1) throw new Error("Book not found in GitHub data");
      books[idx] = { id, ...form };
      const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(books, null, 2))));
      const putRes = await fetch(GITHUB_API, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Edit book: ${form.title}`, content: newContent, sha }),
      });
      if (!putRes.ok) { const e = await putRes.json().catch(() => ({})); throw new Error(e.message || `API error: ${putRes.status}`); }
      setSaveMsg({ ok: true, text: "Saved to GitHub! Changes are live." });
    } catch (err: any) {
      setSaveMsg({ ok: false, text: err.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl text-white font-display text-center mb-6">Karkoub</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold transition-all hover:from-orange-400 hover:to-purple-500">Login</button>
          <Link href="/karkoub" className="block text-center text-white/40 hover:text-white/70 text-sm font-body">&larr; Back</Link>
        </form>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (notFound || !form) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/50 text-lg font-body">Book not found</p>
          <Link href="/karkoub/manage" className="inline-block mt-4 text-purple-400 hover:text-purple-300 underline text-sm font-body">&larr; Back to Manage</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative pt-28 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl text-white font-display truncate max-w-md">{form.title}</h1>
              <p className="text-white/40 text-sm mt-1 font-body">Editing &middot; {id}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowToken(!showToken)} className="px-3 py-2 rounded-xl border border-white/10 text-white/50 text-xs hover:bg-white/5 transition-all">{token ? "Token ✓" : "Set Token"}</button>
              <Link href="/karkoub/manage" className="text-white/40 hover:text-white/70 text-sm font-body transition-colors">&larr; Back</Link>
            </div>
          </div>

          {showToken && (
            <div className="mb-6 p-4 rounded-xl bg-white/[0.06] border border-white/10">
              <label className="block text-white/60 text-xs mb-2 font-body">GitHub Token (repo scope)</label>
              <div className="flex gap-2">
                <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_... or github_pat_..." className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50" />
                <button onClick={saveToken} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold">Save</button>
              </div>
            </div>
          )}

          {saveMsg && (
            <div className={`mb-6 p-4 rounded-xl text-sm text-center ${saveMsg.ok ? "bg-green-500/15 border border-green-500/30 text-green-400" : "bg-red-500/15 border border-red-500/30 text-red-400"}`}>
              {saveMsg.text}
            </div>
          )}

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1 text-sm font-body">Title *</label>
                <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">ASIN</label>
                <input value={form.asin} onChange={(e) => updateField("asin", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">Amazon Link *</label>
                <input value={form.amazonLink} onChange={(e) => updateField("amazonLink", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1 text-sm font-body">Cover Image</label>
                <input value={form.coverImage} onChange={(e) => updateField("coverImage", e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
                <div className="mt-2 flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/[0.06] border border-white/20 text-white/70 text-sm hover:bg-white/[0.1] transition-all">
                    Upload from device
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => updateField("coverImage", ev.target?.result as string); reader.readAsDataURL(file); }} className="hidden" />
                  </label>
                  {form.coverImage && <button type="button" onClick={() => updateField("coverImage", "")} className="px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/25 transition-all">Delete</button>}
                </div>
                {form.coverImage && (
                  <div className="mt-3 w-32 h-44 rounded-xl overflow-hidden border border-white/10 bg-white/[0.04]">
                    <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/60 mb-1 text-sm font-body">Description</label>
                <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">Price</label>
                <input value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="$6.99" className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">Print Length</label>
                <input value={form.printLength} onChange={(e) => updateField("printLength", e.target.value)} placeholder="104 pages" className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">Language</label>
                <input value={form.language} onChange={(e) => updateField("language", e.target.value)} placeholder="English" className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">Publication Date</label>
                <input value={form.publicationDate} onChange={(e) => updateField("publicationDate", e.target.value)} placeholder="March 31, 2026" className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">Dimensions</label>
                <input value={form.dimensions} onChange={(e) => updateField("dimensions", e.target.value)} placeholder="8.5 x 0.24 x 11 inches" className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-white/60 mb-1 text-sm font-body">ISBN-13</label>
                <input value={form.isbn} onChange={(e) => updateField("isbn", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.hidden} onChange={(e) => updateField("hidden", e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/[0.08] accent-purple-600" />
                  <span className="text-white/60 text-sm font-body">Hidden (won&apos;t appear on website)</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-white/60 mb-3 text-sm font-body">Content Pages (Preview Images)</label>
              {form.contentPages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {form.contentPages.map((url, idx) => (
                    <div key={idx} className="relative group aspect-[0.75] rounded-xl overflow-hidden border border-white/10 bg-white/[0.04]">
                      <img src={url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => updateField("contentPages", form.contentPages.filter((_, i) => i !== idx))} className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white/80 text-[10px]">{idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/[0.06] border border-white/20 text-white/70 text-sm hover:bg-white/[0.1] transition-all">
                  Upload from device
                  <input type="file" accept="image/*" multiple onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    const newUrls: string[] = [];
                    let loaded = 0;
                    for (const file of files) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { newUrls.push(ev.target?.result as string); loaded++; if (loaded === files.length) updateField("contentPages", [...form.contentPages, ...newUrls]); };
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" />
                </label>
                <span className="text-white/30 text-xs font-body">or</span>
                <div className="flex-1 flex gap-2">
                  <input type="text" placeholder="Paste image URL..." className="flex-1 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" id="contentUrlInput" />
                  <button type="button" onClick={() => { const input = document.getElementById("contentUrlInput") as HTMLInputElement; const url = input?.value.trim(); if (!url) return; updateField("contentPages", [...form.contentPages, url]); input.value = ""; }} className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/20 text-white/70 text-sm hover:bg-white/[0.1] transition-all">Add</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={saveToGitHub}
                disabled={saving || !form.title || !form.amazonLink}
                className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold transition-all hover:from-green-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {saving ? "Saving..." : "Save to GitHub"}
              </button>
              <Link href={`/karkoub/manage/${id}`} className="px-6 py-3.5 rounded-xl border border-white/10 text-white/50 text-sm font-body hover:bg-white/5 transition-all">
                Reset
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
