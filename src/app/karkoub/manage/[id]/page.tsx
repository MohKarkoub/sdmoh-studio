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

function flatten(arr: any[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];
  function walk(items: any[]) {
    for (const item of items) {
      if (Array.isArray(item)) {
        walk(item);
      } else if (item && typeof item === "object" && item.id) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item);
        }
      }
    }
  }
  walk(arr);
  return result;
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
    const savedToken = localStorage.getItem("github_token") || "";
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
        const books = flatten(JSON.parse(content));
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
          .then((raw) => {
            const books = flatten(raw);
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

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { setAuthenticated(true); sessionStorage.setItem("karkoub_auth", "true"); setError(""); } else { setError("Wrong password"); } }} className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl text-white font-display text-center mb-6">Karkoub / Edit</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-white/[0.12] border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold transition-all hover:from-orange-400 hover:to-purple-500">Login</button>
          <Link href="/karkoub/manage" className="block text-center text-white/40 hover:text-white/70 text-sm font-body">&larr; Back</Link>
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
          <h1 className="text-3xl text-white font-display mb-4">Book not found</h1>
          <Link href="/karkoub/manage" className="text-purple-400 hover:text-purple-300 underline text-sm font-body">&larr; Back to manage</Link>
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
            <h1 className="text-4xl text-white font-display">Edit Book</h1>
            <Link href="/karkoub/manage" className="text-white/40 hover:text-white/70 text-sm font-body transition-colors">&larr; Back</Link>
          </div>
          <p className="text-white/50 text-sm mb-8 font-body">Editing: {form.title}</p>
        </div>
      </div>
    </main>
  );
}
