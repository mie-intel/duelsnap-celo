"use client";

interface ShareButtonsProps {
  correct: number;
  total: number;
  mode: string;
}

function XLogo({ className }: { className?: string }) {
  // X (Twitter) logo — official X path
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.002 2.25H8.08l4.258 5.632 5.907-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function FarcasterLogo({ className }: { className?: string }) {
  // Farcaster — stylized F monogram
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 3H6C4.34 3 3 4.34 3 6v12c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3ZM9 17H7v-6h2v6Zm0-7H7V8h2v2Zm8 7h-2v-4c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v-6h2v.78C13.5 11.3 14.2 11 15 11c1.65 0 2 1.35 2 3v3Z" />
    </svg>
  );
}

export function ShareButtons({ correct, total, mode: _mode }: ShareButtonsProps) {
  const xText = `I scored ${correct}/${total} in DuelSnap! Guess-the-picture duels on Celo. Play free: https://duelsnap.xyz`;
  const fcText = `Scored ${correct}/${total} in DuelSnap duel. Picture quiz game on Celo. Free to play!`;

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;
  const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(fcText)}`;

  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {/* Share to X */}
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-150 active:scale-95 bg-[#0F0F0F] text-white hover:bg-[#1a1a1a] border border-[var(--color-border-subtle)]"
        aria-label="Share score on X (Twitter)"
      >
        <XLogo className="w-4 h-4" />
        Share on X
      </a>

      {/* Share to Farcaster */}
      <a
        href={warpcastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-150 active:scale-95 text-white hover:opacity-90 border border-[var(--color-border-subtle)]"
        style={{ backgroundColor: '#8465CB' }}
        aria-label="Share score on Farcaster"
      >
        <FarcasterLogo className="w-4 h-4" />
        Cast on Farcaster
      </a>
    </div>
  );
}

export default ShareButtons;
