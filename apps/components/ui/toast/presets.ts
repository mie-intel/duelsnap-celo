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
