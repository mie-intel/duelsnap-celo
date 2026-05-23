'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/useWallet';

export default function AutoSignBadge() {
  const { isConnected } = useWallet();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    const seen = localStorage.getItem('autosign_banner_seen');
    if (!seen) setVisible(true);
  }, [isConnected]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[var(--z-overlay)] flex justify-center px-4 pointer-events-none">
      <div
        className="bg-bg-card border border-primary/30 rounded-2xl px-4 py-3 flex items-center gap-3 max-w-sm w-full pointer-events-auto"
        style={{ boxShadow: "0 8px 32px rgba(53,208,127,0.12), 0 0 0 1px rgba(53,208,127,0.15)" }}
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-text-primary">Auto-Sign aktif</p>
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Celo</span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Transaksi game diproses otomatis di Celo — tidak perlu approve tiap kali main.
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('autosign_banner_seen', '1');
            setVisible(false);
          }}
          className="text-text-secondary hover:text-text-primary text-lg leading-none shrink-0 p-1"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
