"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "@Karkoub8891#";

export default function KarkoubDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
          <Link href="/" className="block text-center text-white/40 hover:text-white/70 text-sm font-body">
            &larr; Back to Home
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-4xl text-white font-display mb-4">Karkoub</h1>
        <p className="text-white/50 font-body mb-12">Manage your coloring book portfolio</p>
        <div className="space-y-4">
          <Link
            href="/karkoub/add"
            className="block w-full px-6 py-5 rounded-xl bg-white/[0.08] border border-white/20 text-white hover:bg-white/[0.12] transition-all text-left"
          >
            <span className="text-lg font-semibold">Add New Book</span>
            <p className="text-white/40 text-sm mt-1">Create a new book entry and generate JSON</p>
          </Link>
          <Link
            href="/karkoub/manage"
            className="block w-full px-6 py-5 rounded-xl bg-white/[0.08] border border-white/20 text-white hover:bg-white/[0.12] transition-all text-left"
          >
            <span className="text-lg font-semibold">Manage Books</span>
            <p className="text-white/40 text-sm mt-1">Edit, hide, or delete existing books</p>
          </Link>
        </div>
        <Link href="/" className="inline-block mt-12 text-white/40 hover:text-white/70 text-sm font-body">
          &larr; Back to Home
        </Link>
      </div>
    </main>
  );
}
