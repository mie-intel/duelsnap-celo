"use client";

import { useState, useEffect, useCallback } from "react";
import { formatEther, parseEther, isAddress } from "viem";
import { useWallet } from "../../hooks/useWallet";
import { usePlayerLog } from "../../hooks/usePlayerLog";
import { publicClient } from "../../lib/viem/client";
import { celo } from "../../lib/viem/chain";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { UserIcon } from "../../components/icons";
import { parseContractError } from "../../lib/parseContractError";

export default function ProfilePage() {
  const { address, walletClient, isConnected, isReady, login, logout } =
    useWallet();
  const { stats } = usePlayerLog(address);

  const [celoBalance, setCeloBalance] = useState<bigint>(0n);
  const [copied, setCopied] = useState(false);

  // Send panel
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendPending, setSendPending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!address) return;
    try {
      const bal = await publicClient.getBalance({ address });
      setCeloBalance(bal);
    } catch {}
  }, [address]);

  useEffect(() => {
    refreshBalance();
    const id = setInterval(refreshBalance, 10_000);
    return () => clearInterval(id);
  }, [refreshBalance]);

  const handleSend = async () => {
    if (!walletClient || !address || !isAddress(sendTo) || !sendAmount) return;
    setSendPending(true);
    setSendSuccess(false);
    setSendError(null);
    try {
      const hash = await walletClient.sendTransaction({
        account: address,
        chain: celo,
        to: sendTo as `0x${string}`,
        value: parseEther(sendAmount),
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setSendSuccess(true);
      setTimeout(() => {
        setSendTo("");
        setSendAmount("");
        setShowSend(false);
        setSendSuccess(false);
        refreshBalance();
      }, 2000);
    } catch (e) {
      setSendError(parseContractError(e));
    } finally {
      setSendPending(false);
    }
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-20">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-purple-400/20 border-2 border-primary/30 flex items-center justify-center shadow-lg">
          <UserIcon className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-text-primary mb-1">
            Connect Wallet
          </h2>
          <p className="text-text-secondary text-sm font-sans">
            Connect wallet to view your profile and balances
          </p>
        </div>
        <Button onClick={login} size="lg" className="w-full max-w-xs">
          Connect Wallet
        </Button>
      </div>
    );
  }

  const initials = address.slice(2, 4).toUpperCase();
  const celoFormatted = Number(formatEther(celoBalance)).toFixed(4);
  const winRate =
    stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 bg-bg-page max-w-4xl mx-auto w-full">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">
      {/* Left column — avatar + balance + actions */}
      <div className="lg:sticky lg:top-6">
      {/* Avatar + address */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center text-2xl font-bold font-display text-primary mb-3">
          {initials}
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs font-mono mt-1 transition-colors ${
            copied
              ? "text-success"
              : "text-text-secondary active:text-text-primary"
          }`}
        >
          {copied ? (
            "✓ Copied!"
          ) : (
            <>
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
              {`${address.slice(0, 6)}…${address.slice(-4)} · tap to copy`}
            </>
          )}
        </button>
      </div>

      {/* CELO Balance */}
      <div className="bg-bg-card rounded-2xl p-4 mb-5 shadow-sm">
        <p className="text-text-secondary text-xs font-sans mb-1">
          CELO Balance
        </p>
        <p className="text-text-primary font-bold font-display text-3xl">
          {celoFormatted}
        </p>
        <p className="text-text-secondary text-[10px] font-sans mt-0.5">
          Celo Mainnet
        </p>
      </div>

      {/* Action buttons: Send / Receive */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => {
            setShowSend(true);
            setShowReceive(false);
            setSendError(null);
            setSendSuccess(false);
          }}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-bg-card border border-black/10 hover:border-primary/40 hover:bg-primary/5 active:border-primary/30 transition-colors shadow-sm"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span className="text-text-primary text-[10px] font-medium font-sans">
            Send
          </span>
        </button>
        <button
          onClick={() => {
            setShowReceive(true);
            setShowSend(false);
          }}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-bg-card border border-black/10 hover:border-primary/40 hover:bg-primary/5 active:border-primary/30 transition-colors shadow-sm"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          <span className="text-text-primary text-[10px] font-medium font-sans">
            Receive
          </span>
        </button>
      </div>

      {/* Send panel */}
      {showSend && (
        <div className="bg-bg-card rounded-2xl p-4 mb-4 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-primary font-semibold text-sm font-sans">
              Send CELO
            </p>
            <button
              onClick={() => {
                setShowSend(false);
                setSendError(null);
                setSendSuccess(false);
              }}
              className="px-3 py-1 rounded-lg bg-bg-page text-text-secondary text-xs font-sans border border-black/10 hover:bg-black/5 hover:border-black/20 transition-colors"
            >
              Close
            </button>
          </div>
          <input
            type="text"
            placeholder="Recipient address (0x...)"
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            className="w-full bg-bg-page border border-black/10 rounded-xl px-3 py-2.5 text-text-primary text-sm font-mono mb-2 outline-none focus:border-primary/40"
          />
          <input
            type="number"
            placeholder="Amount in CELO (e.g. 0.01)"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full bg-bg-page border border-black/10 rounded-xl px-3 py-2.5 text-text-primary text-sm font-mono mb-3 outline-none focus:border-primary/40"
          />
          <button
            onClick={handleSend}
            disabled={sendPending || !isAddress(sendTo) || !sendAmount}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm font-sans hover:bg-primary-dark disabled:opacity-40 disabled:hover:bg-primary transition-colors"
          >
            {sendPending
              ? "Sending..."
              : sendSuccess
                ? "✓ Sent!"
                : "Send CELO"}
          </button>
          {sendSuccess && (
            <p className="text-success text-xs mt-2 text-center font-sans">
              Transaction confirmed
            </p>
          )}
          {sendError && (
            <p className="text-error text-xs mt-2 font-sans">{sendError}</p>
          )}
        </div>
      )}

      {/* Receive panel */}
      {showReceive && (
        <div className="bg-bg-card rounded-2xl p-4 mb-4 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-primary font-semibold text-sm font-sans">
              Receive
            </p>
            <button
              onClick={() => setShowReceive(false)}
              className="px-3 py-1 rounded-lg bg-bg-page text-text-secondary text-xs font-sans border border-black/10 hover:bg-black/5 hover:border-black/20 transition-colors"
            >
              Close
            </button>
          </div>
          <div className="bg-bg-page border border-black/10 rounded-xl p-3 mb-3">
            <p className="text-text-secondary text-[10px] font-sans mb-1">
              Your Celo address
            </p>
            <p className="text-text-primary text-xs font-mono break-all leading-relaxed">
              {address}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-xl font-semibold text-sm font-sans transition-colors ${
              copied
                ? "bg-success/10 border border-success/30 text-success"
                : "bg-primary text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy Address"}
          </button>
        </div>
      )}

      {/* Network + Disconnect — inside left column on desktop */}
      <div className="hidden lg:flex flex-col gap-3 mt-4">
        <div className="bg-bg-card rounded-2xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-text-primary text-sm font-semibold font-sans">Network</p>
            <p className="text-text-secondary text-xs font-sans mt-0.5">Celo Mainnet</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-success" />
        </div>
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl border border-error/30 text-error text-sm font-semibold font-sans transition-all hover:bg-error/10 hover:border-error/60 active:scale-[0.98] active:opacity-70"
        >
          Disconnect Wallet
        </button>
      </div>
      </div>{/* end left column */}

      {/* Right column — stats + network/disconnect on mobile */}
      <div>
        {/* Separator mobile only */}
        <div className="lg:hidden border-t border-black/5 mb-5" />

        {/* Game stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Games", value: stats.total },
            { label: "Wins", value: stats.wins },
            { label: "Win Rate", value: `${winRate}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-bg-card rounded-2xl p-3 text-center shadow-sm"
            >
              <p className="text-text-primary font-bold font-display text-lg">
                {value}
              </p>
              <p className="text-text-secondary text-[10px] font-sans">{label}</p>
            </div>
          ))}
        </div>

        {/* Network + Disconnect — mobile only */}
        <div className="lg:hidden flex flex-col gap-3">
          <div className="bg-bg-card rounded-2xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-semibold font-sans">Network</p>
              <p className="text-text-secondary text-xs font-sans mt-0.5">Celo Mainnet</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <button
            onClick={logout}
            className="w-full py-3 rounded-2xl border border-error/30 text-error text-sm font-semibold font-sans transition-all hover:bg-error/10 hover:border-error/60 active:scale-[0.98] active:opacity-70"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>{/* end right column */}
      </div>{/* end grid */}
    </div>
  );
}
