import type { Toast } from './types';

export function winToast(score: string, reward?: string, currency: 'CELO' | 'cUSD' = 'CELO'): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: `Victory — ${score}`,
    description: reward ? `+${reward} ${currency} earned on-chain` : 'Keep it up!',
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

export function tieToast(score: string): Omit<Toast, 'id'> {
  return {
    type: 'info',
    title: `Draw — ${score}`,
    description: 'Wager refunded to both players.',
    duration: 4500,
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

export function royaltyToast(amount: string, currency: 'CELO' | 'cUSD' = 'CELO'): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: 'Royalty earned',
    description: `+${amount} ${currency} from your photo contribution`,
    duration: 5000,
  };
}

/** Shown after a cUSD fee is deducted for a casual game. */
export function cusdFeeToast(amount: string): Omit<Toast, 'id'> {
  return {
    type: 'info',
    title: 'Game fee paid',
    description: `${amount} cUSD deducted — 90% goes to contributors`,
    duration: 4000,
  };
}

/** Shown when a cUSD royalty is accumulated for a question contributor. */
export function cusdRoyaltyToast(amount: string): Omit<Toast, 'id'> {
  return {
    type: 'success',
    title: 'cUSD royalty earned',
    description: `+${amount} cUSD from your question contribution`,
    duration: 5000,
  };
}
