'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface WalletGuardProps {
  children: React.ReactNode;
}

function detectMiniPay(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay);
}

export default function WalletGuard({ children }: WalletGuardProps) {
  const { isConnected, isReady, login } = useWallet();
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    setIsMiniPay(detectMiniPay());
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-purple-400/20 border-2 border-primary/30 flex items-center justify-center text-5xl shadow-lg">
          🎮
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
            Connect Wallet
          </h2>
          {isMiniPay ? (
            <p className="text-text-secondary text-sm">
              MiniPay detected — tap below to connect instantly
            </p>
          ) : (
            <p className="text-text-secondary text-sm">
              Sign in with Google, MetaMask, or any Celo-compatible wallet to play and earn
            </p>
          )}
        </div>

        {isMiniPay && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            MiniPay wallet ready
          </div>
        )}

        <Button onClick={login} size="lg" className="w-full max-w-xs">
          {isMiniPay ? 'Connect MiniPay' : 'Connect Wallet'}
        </Button>

        {!isMiniPay && (
          <p className="text-text-secondary/60 text-xs text-center max-w-[28ch]">
            Using Opera MiniPay? Open this app there for instant connect.
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
