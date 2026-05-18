"use client";

import Link from "next/link";
import Image from "next/image";
import { useWallet } from "../../hooks/useWallet";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import {
  GamepadIcon,
  CoinIcon,
  SwordsIcon,
  CameraIcon,
} from "../../components/icons";

export default function Home() {
  const { address, isConnected, isReady, login } = useWallet();

  return (
    <div className="flex flex-col flex-1 bg-bg-page">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="DuelSnap"
            width={36}
            height={36}
            className="rounded-lg"
            priority
          />
          <span className="font-display font-bold text-xl text-text-primary">
            DuelSnap
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isReady ? (
            <Spinner size="sm" />
          ) : isConnected ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-mono text-text-secondary bg-primary-light px-3 py-1.5 rounded-full">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <Button size="sm" onClick={login}>
              Connect Wallet
            </Button>
          )}
        </div>
      </header>
        {/* Ezy*/}
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-5 py-10 pb-24 gap-8 max-w-lg mx-auto w-full">
        <div className="text-center">
          <h1 className="font-display font-bold text-4xl text-text-primary leading-tight">
            Guess the Picture.
            <br />
            <span className="text-primary">Earn Real Rewards.</span>
          </h1>
          <p className="mt-3 text-text-secondary text-base">
            Play free, earn royalties, or wager CELO in 1v1 duels.
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="flex flex-col gap-4 w-full">
          <Link href="/casual" className="block">
            <Card
              className="border border-transparent hover:border-accent-free transition-colors"
              style={
                { "--hover-border-color": "var(--color-accent-free)" } as any
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-free-light)" }}
                >
                  <GamepadIcon className="w-7 h-7 text-accent-free-dark" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-text-primary">
                      Free Casual
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--color-accent-free-light)",
                        color: "var(--color-accent-free)",
                      }}
                    >
                      FREE
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mt-0.5">
                    5 questions · 3 rounds/day · No wallet needed
                  </p>
                </div>
                <span className="text-text-secondary">›</span>
              </div>
            </Card>
          </Link>

          <Link href="/casual?mode=paid" className="block">
            <Card
              className="border border-transparent hover:border-accent-paid transition-colors"
              style={
                { "--hover-border-color": "var(--color-accent-paid)" } as any
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-paid-light)" }}
                >
                  <CoinIcon className="w-7 h-7 text-accent-paid-dark" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-text-primary">
                      Paid Casual
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--color-accent-paid-light)",
                        color: "var(--color-accent-paid)",
                      }}
                    >
                      0.01 CELO
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mt-0.5">
                    10 questions · Earn royalties · Contributors rewarded
                  </p>
                </div>
                <span className="text-text-secondary">›</span>
              </div>
            </Card>
          </Link>

          <Link href="/pvp/lobby" className="block">
            <Card
              className="border border-transparent hover:border-accent-pvp transition-colors"
              style={
                { "--hover-border-color": "var(--color-accent-pvp)" } as any
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-pvp-light)" }}
                >
                  <SwordsIcon className="w-7 h-7 text-accent-pvp-dark" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-text-primary">
                      PvP Ranked
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--color-accent-pvp-light)",
                        color: "var(--color-accent-pvp)",
                      }}
                    >
                      0.1 CELO WAGER
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mt-0.5">
                    1v1 · 10 questions · Winner takes 87%
                  </p>
                </div>
                <span className="text-text-secondary">›</span>
              </div>
            </Card>
          </Link>

          <Link href="/contribute" className="block">
            <Card
              className="border border-dashed border-text-secondary/30 hover:border-accent-contribute transition-colors"
              style={
                {
                  "--hover-border-color": "var(--color-accent-contribute)",
                } as any
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--color-accent-contribute-light)",
                  }}
                >
                  <CameraIcon className="w-7 h-7 text-accent-contribute-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-text-primary">
                    Contribute Questions
                  </h3>
                  <p className="text-text-secondary text-sm mt-0.5">
                    Submit images · AI verified · Earn royalties forever
                  </p>
                </div>
                <span className="text-text-secondary">›</span>
              </div>
            </Card>
          </Link>
        </div>

        {isReady && !isConnected && (
          <Button onClick={login} size="lg" className="w-full">
            Connect Wallet
          </Button>
        )}
      </main>
    </div>
  );
}
