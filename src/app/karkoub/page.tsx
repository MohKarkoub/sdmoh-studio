"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "@Karkoub8891#";
const BOOKS_JSON_URL = "https://raw.githubusercontent.com/MohKarkoub/sdmoh-studio/main/public/books.json";

export default function KarkoubDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, visible: 0, hidden: 0 });
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("karkoub_auth") === "true") {
      setAuthenticated(true);
    }
    const savedToken = (localStorage.getItem("github_token") || "").trim();
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          total: data.length,
          visible: data.filter((b: any) => !b.hidden).length,
          hidden: data.filter((b: any) => b.hidden).length,
        });
      })
      .catch(() => {});
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

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5 relative">
          <div className="text-center mb-2">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/25">
              K
            </div>
            <h1 className="text-3xl text-white font-display">Karkoub</h1>
            <p className="text-white/40 text-sm mt-1 font-body">Portfolio Dashboard</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold transition-all hover:from-orange-400 hover:to-purple-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
          >
            Sign In
          </button>
          <Link href="/" className="block text-center text-white/30 hover:text-white/60 text-sm font-body transition-colors">
            &larr; Back to Home
          </Link>
        </form>
      </main>
    );
  }

  const statCards = [
    { label: "Total Books", value: stats.total, gradient: "from-blue-500 to-cyan-500", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    )},
    { label: "Visible", value: stats.visible, gradient: "from-green-500 to-emerald-500", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    )},
    { label: "Hidden", value: stats.hidden, gradient: "from-red-500 to-rose-500", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    )},
  ];

  return (
    <main className="min-h-screen pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-5xl text-white font-display">Karkoub</h1>
              <p className="text-white/40 mt-2 font-body">Manage your coloring book portfolio</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowToken(!showToken)} className="px-3 py-2 rounded-xl border border-white/10 text-white/50 text-xs hover:bg-white/5 transition-all">
                {token ? "Token ✓" : "Set Token"}
              </button>
              <Link href="/" className="text-white/30 hover:text-white/60 text-sm font-body transition-colors">&larr; Home</Link>
            </div>
          </div>

          {showToken && (
            <div className="mb-8 p-4 rounded-xl bg-white/[0.06] border border-white/10">
              <label className="block text-white/60 text-xs mb-2 font-body">GitHub Token (repo scope)</label>
              <div className="flex gap-2">
                <input type="password" value={token} onChange={(e) => setToken(e.target.value.trim())} placeholder="ghp_... or github_pat_..." className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50" />
                <button onClick={() => { const t = token.trim(); setToken(t); localStorage.setItem("github_token", t); setShowToken(false); }} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-semibold">Save</button>
              </div>
              <p className="text-white/30 text-[11px] mt-2 font-body">
                Token is saved in your browser and shared across all Karkoub pages
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {statCards.map((s) => (
              <div key={s.label} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/[0.02] rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-xs font-medium uppercase tracking-wider font-body">{s.label}</span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {s.icon}
                    </div>
                  </div>
                  <p className="text-3xl text-white font-display">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4 font-body">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/karkoub/add"
              className="group relative p-6 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-purple-600/10 rounded-full blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-display text-lg">Add New Book</h3>
                  <p className="text-white/40 text-sm mt-1 font-body">Create a new book entry and generate JSON</p>
                </div>
              </div>
            </Link>
            <Link
              href="/karkoub/manage"
              className="group relative p-6 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-white font-display text-lg">Manage Books</h3>
                  <p className="text-white/40 text-sm mt-1 font-body">Edit, hide, or delete existing books</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
