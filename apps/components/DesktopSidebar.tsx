'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { GamepadIcon, CameraIcon, UserIcon, LogIcon, TrophyIcon } from './icons';

const tabs = [
  { href: '/play', label: 'Play', Icon: GamepadIcon },
  { href: '/leaderboard', label: 'Leaderboard', Icon: TrophyIcon },
  { href: '/activity', label: 'Activity', Icon: LogIcon },
  { href: '/profile', label: 'Profile', Icon: UserIcon },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-bg-card border-r border-white/5 px-3 py-6">
      <Link href="/" className="flex items-center gap-2.5 px-3 mb-8">
        <Image src="/logo.png" alt="DuelSnap" width={32} height={32} className="rounded-lg" />
        <span className="font-display font-bold text-lg text-text-primary">DuelSnap</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === '/play' ? pathname === '/play' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-sans transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
