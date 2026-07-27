"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  className?: string;
}

export default function ShareButtons({
  title,
  description = "",
  imageUrl = "",
  url = "",
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showInstagramNote, setShowInstagramNote] = useState(false);

  const shareUrl = typeof window !== "undefined" ? (url || window.location.href) : url;
  const shareText = `Check out "${title}" by SDMoh Studio - ${description.slice(0, 100)}...`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleInstagramShare = () => {
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      navigator.share({
        title,
        text: `${shareText}\n\n${shareUrl}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
      setShowInstagramNote(true);
      setTimeout(() => setShowInstagramNote(false), 4000);
    }
  };

  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    shareUrl
  )}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(title + " - " + description)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    shareText + " " + shareUrl
  )}`;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold text-white/50 uppercase tracking-wider">
        <span>Share Design</span>
        {copied && (
          <span className="text-emerald-400 font-medium flex items-center gap-1 animate-fade-in">
            <Check className="w-3 h-3" /> Link Copied!
          </span>
        )}
      </div>

      {showInstagramNote && (
        <div className="text-xs bg-purple-900/50 border border-purple-500/30 text-purple-200 p-2.5 rounded-lg leading-relaxed animate-fade-in">
          📸 Link copied! Open Instagram to paste in your Story or Post.
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {/* Pinterest */}
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Pinterest"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 hover:border-red-500/60 transition-all duration-200 group"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium text-red-200">Pin</span>
        </a>

        {/* Instagram */}
        <button
          onClick={handleInstagramShare}
          title="Share to Instagram"
          type="button"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-pink-600/20 border border-pink-500/30 text-pink-300 hover:bg-pink-600/30 hover:border-pink-500/60 transition-all duration-200 group"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium text-pink-200">Insta</span>
        </button>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-white/80 hover:bg-zinc-700 hover:text-white transition-all duration-200 group"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium text-white/70">X</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-500/60 transition-all duration-200 group"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.001 5.45-4.436 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.18-1.238-6.168-3.483-8.413" />
          </svg>
          <span className="text-[10px] mt-1 font-medium text-emerald-200">WA</span>
        </a>

        {/* Copy Link / Share */}
        <button
          onClick={handleNativeShare}
          title="Copy Link or Share"
          type="button"
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 hover:border-blue-500/60 transition-all duration-200 group"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-[10px] mt-1 font-medium text-blue-200">
            {copied ? "Copied" : "Share"}
          </span>
        </button>
      </div>
    </div>
  );
}
