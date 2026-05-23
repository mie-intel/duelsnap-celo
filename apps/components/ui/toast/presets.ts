import type { Toast } from './types';

export function winToast(score: string, reward?: string): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: `Victory — ${score}`,
    description: reward ? `+${reward} CELO earned on-chain` : 'Keep it up!',
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

export function txConfirmedToast(txHash: string): Omit<Toast, 'id'> {
  const short = `${txHash.slice(0, 8)}…${txHash.slice(-6)}`;
  return {
    type: 'success',
    title: 'Transaction confirmed',
    description: `Settled on Celo · ${short}`,
    duration: 6000,
    action: {
      label: 'View on Blockscout',
      onClick: () => window.open(`https://celo.blockscout.com/tx/${txHash}`, '_blank'),
    },
  };
}

export function matchFoundToast(opponentName: string): Omit<Toast, 'id'> {
  return {
    type: 'info',
    title: 'Opponent found!',
    description: `Matched with ${opponentName} on Celo`,
    duration: 3000,
  };
}

export function badgeUnlockedToast(badgeLabel: string): Omit<Toast, 'id'> {
  return {
    type: 'celebration',
    title: `Badge unlocked: ${badgeLabel}`,
    description: 'Achievement recorded on your Celo profile',
    duration: 5000,
  };
}

export function royaltyToast(amount: string): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: 'Royalty earned',
    description: `+${amount} CELO from your photo contribution`,
    duration: 5000,
  };
}
