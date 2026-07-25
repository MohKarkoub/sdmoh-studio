"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "@Karkoub8891#";

interface BookForm {
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
  contentPages: string[];
  hidden: boolean;
}

const emptyForm: BookForm = {
  title: "",
  asin: "",
  amazonLink: "",
  coverImage: "",
  description: "",
  printLength: "",
  language: "",
  publicationDate: "",
  dimensions: "",
  isbn: "",
  price: "",
  contentPages: [],
  hidden: false,
};

export default function AddBookPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("karkoub_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

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

  function generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.amazonLink) return;
    const newBook = {
      id: generateId(form.title),
      ...form,
    };
    const json = JSON.stringify(newBook, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function updateField(field: keyof BookForm, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl text-white font-display">Karkoub / Add Book</h1>
          <Link href="/karkoub" className="text-white/40 hover:text-white/70 text-sm font-body">
            &larr; Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-white/60 mb-1 text-sm">Title *</label>
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">ASIN</label>
              <input
                value={form.asin}
                onChange={(e) => updateField("asin", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">Amazon Link *</label>
              <input
                value={form.amazonLink}
                onChange={(e) => updateField("amazonLink", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/60 mb-1 text-sm">Cover Image URL</label>
              <input
                value={form.coverImage}
                onChange={(e) => updateField("coverImage", e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
              <div className="mt-2 flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/[0.08] border border-white/20 text-white/70 text-sm hover:bg-white/[0.12] transition-all">
                  Upload from device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        updateField("coverImage", dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
                {form.coverImage && (
                  <button
                    type="button"
                    onClick={() => updateField("coverImage", "")}
                    className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm hover:bg-red-500/30 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
              {form.coverImage && (
                <div className="mt-3 w-32 h-44 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={form.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/60 mb-1 text-sm">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">Price (e.g., $6.99)</label>
              <input
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="$6.99"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">Print Length</label>
              <input
                value={form.printLength}
                onChange={(e) => updateField("printLength", e.target.value)}
                placeholder="104 pages"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">Language</label>
              <input
                value={form.language}
                onChange={(e) => updateField("language", e.target.value)}
                placeholder="English"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">Publication Date</label>
              <input
                value={form.publicationDate}
                onChange={(e) => updateField("publicationDate", e.target.value)}
                placeholder="March 31, 2026"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">Dimensions</label>
              <input
                value={form.dimensions}
                onChange={(e) => updateField("dimensions", e.target.value)}
                placeholder="8.5 x 0.24 x 11 inches"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1 text-sm">ISBN-13</label>
              <input
                value={form.isbn}
                onChange={(e) => updateField("isbn", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hidden}
                  onChange={(e) => updateField("hidden", e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.08] accent-purple-600"
                />
                <span className="text-white/60 text-sm">Hidden (won&apos;t appear on website)</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-white/10">
            <label className="block text-white/60 mb-3 text-sm">Content Pages (Preview Images)</label>
            {form.contentPages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {form.contentPages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-[0.75] rounded-xl overflow-hidden border border-white/10">
                    <img src={url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.contentPages.filter((_, i) => i !== idx);
                        updateField("contentPages", updated);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white/80 text-[10px]">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/[0.08] border border-white/20 text-white/70 text-sm hover:bg-white/[0.12] transition-all">
                Upload from device
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    const newUrls: string[] = [];
                    let loaded = 0;
                    for (const file of files) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        newUrls.push(ev.target?.result as string);
                        loaded++;
                        if (loaded === files.length) {
                          updateField("contentPages", [...form.contentPages, ...newUrls]);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
                  id="contentUrlInput"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("contentUrlInput") as HTMLInputElement;
                    const url = input?.value.trim();
                    if (!url) return;
                    updateField("contentPages", [...form.contentPages, url]);
                    input.value = "";
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] border border-white/20 text-white/70 text-sm hover:bg-white/[0.12] transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold transition-all hover:from-orange-400 hover:to-purple-500"
          >
            Generate JSON
          </button>
        </form>

        {copied && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 text-sm text-center">
            <strong>JSON copied!</strong> Go to{" "}
            <a
              href="https://github.com/MohKarkoub/sdmoh-studio/edit/main/public/books.json"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-300"
            >
              GitHub books.json
            </a>
            , add a comma after the last book, and paste this new entry before the closing bracket.
          </div>
        )}
      </div>
    </main>
  );
}
