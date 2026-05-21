import type { Toast } from './types';

export function winToast(score: string, reward?: string): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: `Victory — ${score}`,
    description: reward ? `+${reward} CELO earned` : 'Keep it up!',
    duration: 5000,
  };
}

export function lossToast(score: string): Omit<Toast, 'id'> {
  return {
    type: 'error',
    title: `Defeat — ${score}`,
    description: 'Better luck next round.',
    duration: 4000,
  };
}

export function txConfirmedToast(txHash: string, explorerUrl?: string): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: 'Transaction confirmed',
    description: `${txHash.slice(0, 8)}…${txHash.slice(-6)}`,
    duration: 5000,
    action: explorerUrl
      ? { label: 'View on Celoscan', onClick: () => window.open(explorerUrl, '_blank') }
      : undefined,
  };
}

export function txPendingToast(): Omit<Toast, 'id'> {
  return {
    type: 'info',
    title: 'Transaction submitted',
    description: 'Waiting for confirmation...',
    duration: 8000,
  };
}

export function txFailedToast(reason?: string): Omit<Toast, 'id'> {
  return {
    type: 'error',
    title: 'Transaction failed',
    description: reason ?? 'Check your wallet and try again.',
    duration: 6000,
  };
}

export function opponentFoundToast(opponentAddress: string): Omit<Toast, 'id'> {
  return {
    type: 'info',
    title: 'Opponent found!',
    description: `${opponentAddress.slice(0, 6)}…${opponentAddress.slice(-4)} joined the duel`,
    duration: 5000,
  };
}

export function badgeUnlockedToast(badgeName: string): Omit<Toast, 'id'> {
  return {
    type: 'celebration',
    title: 'Badge unlocked',
    description: badgeName,
    duration: 6000,
  };
}
