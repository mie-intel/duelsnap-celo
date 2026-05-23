"use client";

import { useState } from "react";
import { formatEther } from "viem";

interface StatsHeaderProps {
  address: string;
  celoBalance: bigint;
  stats: {
    total: number;
    wins: number;
    losses: number;
    netProfitLoss: number;
  };
}

export default function StatsHeader({ address, celoBalance, stats }: StatsHeaderProps) {
  const [copied, setCopied] = useState(false);

  const initials = address.slice(2, 4).toUpperCase();
  const shortAddress = `${address.slice(0, 6)}…${address.slice(-4)}`;
  const celoFormatted = Number(formatEther(celoBalance)).toFixed(4);
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] p-5 mb-5">
      {/* Avatar + address */}
      <div className="flex flex-col items-center mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-display mb-3"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), #FBCC5C)",
            color: "#0F001F",
          }}
        >
          {initials}
        </div>

        {/* Network badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="text-[var(--color-text-secondary)] text-xs font-sans">Celo Mainnet · Chain 42220</span>
        </div>

        {/* Address + copy */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {copied ? (
            <span className="text-[var(--color-primary)]">Copied!</span>
          ) : (
            <>
              {shortAddress}
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* CELO Balance */}
      <div className="text-center mb-5">
        <p className="text-[var(--color-text-secondary)] text-xs font-sans mb-1">CELO Balance</p>
        <p className="font-display font-bold text-3xl text-[var(--color-text-primary)]">
          {celoFormatted}
        </p>
        <p className="text-[var(--color-text-secondary)] text-[10px] font-sans mt-0.5">CELO</p>
        {/* Net P&L pill */}
        {stats.netProfitLoss !== 0 && (
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
            stats.netProfitLoss > 0
              ? "bg-primary/10 text-primary"
              : "bg-error/10 text-error"
          }`}>
            {stats.netProfitLoss > 0 ? "+" : ""}{stats.netProfitLoss.toFixed(3)} CELO net
          </div>
        )}
        {/* Blockscout profile link */}
        <div className="mt-2">
          <a
            href={`https://celo.blockscout.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-text-secondary/50 hover:text-primary transition-colors font-mono"
          >
            View on Blockscout ↗
          </a>
        </div>
      </div>

      {/* 3 quick stats — single card with dividers */}
      <div className="flex divide-x divide-[var(--color-border-subtle)]">
        {[
          { label: "Games", value: stats.total },
          { label: "Wins", value: stats.wins },
          { label: "Win Rate", value: `${winRate}%` },
        ].map(({ label, value }) => (
          <div key={label} className="flex-1 text-center px-3 py-1">
            <p className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              {value}
            </p>
            <p className="text-[var(--color-text-secondary)] text-[10px] font-sans">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
