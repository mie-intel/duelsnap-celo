"use client";

export interface LeaderboardEntry {
  rank: number;
  address: string;
  wins: number;
  losses: number;
  totalCelo: number; // in wei
  change: number; // rank delta since last period, positive = improved
  isCurrentUser?: boolean;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatCelo(wei: number): string {
  const celo = wei / 1e18;
  if (celo >= 1000) return `${(celo / 1000).toFixed(1)}K`;
  if (celo >= 1) return celo.toFixed(2);
  return celo.toFixed(4);
}

function winRate(wins: number, losses: number): number {
  const total = wins + losses;
  return total === 0 ? 0 : Math.round((wins / total) * 100);
}

interface Props {
  entry: LeaderboardEntry;
}

export function LeaderboardRow({ entry }: Props) {
  const rate = winRate(entry.wins, entry.losses);
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors ${
        entry.isCurrentUser
          ? "bg-primary/10 border-primary/30"
          : "bg-surface-1 border-border-subtle hover:bg-surface-2 hover:border-border-mid"
      }`}
      role="row"
    >
      {/* Rank number */}
      <span
        className={`w-8 shrink-0 text-center font-mono font-bold text-sm ${
          entry.rank === 1
            ? "text-[#FBCC5C]"
            : entry.rank === 2
              ? "text-[#C0C8D8]"
              : entry.rank === 3
                ? "text-[#CD7F32]"
                : "text-text-secondary"
        }`}
      >
        {entry.rank}
      </span>

      {/* Avatar placeholder */}
      <div
        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold font-display ${
          isTop3 ? "bg-primary/20 text-primary" : "bg-surface-2 text-text-secondary"
        }`}
      >
        {entry.address.slice(2, 4).toUpperCase()}
      </div>

      {/* Address + Blockscout link */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <a
            href={`https://celo.blockscout.com/address/${entry.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono text-sm font-medium truncate hover:underline ${
              entry.isCurrentUser ? "text-primary" : "text-text-primary"
            }`}
          >
            {truncateAddress(entry.address)}
          </a>
          {entry.isCurrentUser && (
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/70">
              you
            </span>
          )}
        </div>
        <p className="text-text-secondary text-[10px] font-sans mt-0.5">
          {entry.wins}W · {entry.losses}L · {rate}% WR
        </p>
      </div>

      {/* CELO earned */}
      <div className="text-right shrink-0">
        <p className="font-display font-bold text-sm text-secondary">
          {formatCelo(entry.totalCelo)}
        </p>
        <p className="text-text-secondary text-[10px] font-sans">CELO</p>
      </div>
    </div>
  );
}
