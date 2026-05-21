export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Category {
  id: string;
  label: string;
  description: string;
  icon: string; // SVG path data (d attribute), 24x24 viewBox
  color: string; // CSS var or hex for accent
  colorLight: string; // lighter version for bg
}

export const CATEGORIES: Category[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Mixed topics',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    color: 'var(--color-primary)',
    colorLight: 'rgba(53,208,127,0.12)',
  },
  {
    id: 'landmarks',
    label: 'Landmarks',
    description: 'Famous places worldwide',
    icon: 'M3 21h18M9 21V9l3-6 3 6v12M5 21V13l4-4M19 21V13l-4-4M9 13h6',
    color: '#60A5FA',
    colorLight: 'rgba(96,165,250,0.12)',
  },
  {
    id: 'food',
    label: 'Food & Drink',
    description: 'Cuisine from around the world',
    icon: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
    color: 'var(--color-secondary)',
    colorLight: 'rgba(251,204,92,0.12)',
  },
  {
    id: 'nature',
    label: 'Nature',
    description: 'Animals, plants, landscapes',
    icon: 'M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 0 0 5.56 22a1 1 0 0 0 .78-.37 5.75 5.75 0 0 1 4.39-2.13c.91 0 1.49.56 2.27.56S14.23 19.5 15.14 19.5a5.75 5.75 0 0 1 4.39 2.13 1 1 0 0 0 .78.37 2 2 0 0 0 1.74-2.18C21.5 15.5 19 6 17 8z',
    color: '#34D399',
    colorLight: 'rgba(52,211,153,0.12)',
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Gadgets and innovation',
    icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
    color: '#818CF8',
    colorLight: 'rgba(129,140,248,0.12)',
  },
  {
    id: 'sports',
    label: 'Sports',
    description: 'Athletes and sporting moments',
    icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0 0V12m0 0L7 7m5 5l5-5',
    color: 'var(--color-error)',
    colorLight: 'rgba(255,77,77,0.12)',
  },
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy — longer timer, common subjects',
  medium: 'Medium — balanced challenge',
  hard: 'Hard — fast timer, rare subjects',
};
