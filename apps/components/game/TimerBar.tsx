'use client';

import { useEffect, useState, useRef } from 'react';

interface TimerBarProps {
  durationMs: number;
  onExpire: () => void;
  resetKey: number;
}

export default function TimerBar({ durationMs, onExpire, resetKey }: TimerBarProps) {
  const [remaining, setRemaining] = useState(durationMs);
  const endRef = useRef(Date.now() + durationMs);
  const expiredRef = useRef(false);

  useEffect(() => {
    endRef.current = Date.now() + durationMs;
    expiredRef.current = false;
    setRemaining(durationMs);

    const id = setInterval(() => {
      const left = Math.max(0, endRef.current - Date.now());
      setRemaining(left);
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpire();
      }
    }, 50);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, durationMs]);

  const pct = (remaining / durationMs) * 100;

  const barColor = pct > 50
    ? '#35D07F'
    : pct > 25
    ? '#FBCC5C'
    : '#FF4D4D';

  const glowColor = pct > 50
    ? 'rgba(53,208,127,0.35)'
    : pct > 25
    ? 'rgba(251,204,92,0.35)'
    : 'rgba(255,77,77,0.45)';

  return (
    <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-visible">
      <div
        className="h-full rounded-full transition-[width,background-color] duration-100"
        style={{
          width: `${pct}%`,
          backgroundColor: barColor,
          boxShadow: pct < 30 ? `0 0 8px ${glowColor}` : 'none',
        }}
      />
    </div>
  );
}
