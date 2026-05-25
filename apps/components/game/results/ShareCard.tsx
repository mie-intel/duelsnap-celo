"use client";

import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";

interface ShareCardProps {
  correct: number;
  total: number;
  mode: "free" | "paid";
  reward?: string;
}

function buildShareText(correct: number, total: number, mode: "free" | "paid", reward?: string) {
  const emoji = correct / total >= 0.8 ? "🔥" : correct / total >= 0.5 ? "✅" : "📸";
  const modeLabel = mode === "paid" ? "paid" : "free";
  const rewardPart = reward ? ` and earned ${reward} CELO` : "";
  return `${emoji} Just scored ${correct}/${total} on DuelSnap (${modeLabel} mode)${rewardPart}! Challenge me on Celo 👉 https://duelsnap.xyz`;
}

/**
 * Share game result via Web Share API or copy-to-clipboard fallback.
 */
export function ShareCard({ correct, total, mode, reward }: ShareCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const text = buildShareText(correct, total, mode, reward);

  async function handleShare() {
    if (navigator?.share) {
      try {
        await navigator.share({ text, url: "https://duelsnap.xyz" });
        return;
      } catch {
        // User cancelled or API failed — fall through to copy
      }
    }
    await copy(text);
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;

  return (
    <div className="bg-bg-card rounded-3xl border border-border-subtle p-4 flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
        Share result
      </p>

      {/* Share text preview */}
      <p className="text-sm text-text-secondary font-sans leading-relaxed bg-surface-1 rounded-xl p-3">
        {text}
      </p>

      <div className="flex gap-2 flex-wrap">
        {/* Copy / Web Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-text-inverse text-sm font-semibold transition-all hover:bg-primary-dark active:scale-95"
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>

        {/* Tweet */}
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1DA1F2] text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        >
          𝕏 Tweet
        </a>

        {/* Warpcast */}
        <a
          href={warpcastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        >
          🟣 Warpcast
        </a>
      </div>
    </div>
  );
}
