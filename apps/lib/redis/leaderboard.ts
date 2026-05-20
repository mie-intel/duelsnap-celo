import { redis } from "./client";

export type LeaderboardTab = "global" | "weekly";

export interface LeaderboardEntryRaw {
  address: string;
  wins: number;
  losses: number;
  totalCelo: number; // wei as number
}

function keyFor(tab: LeaderboardTab): string {
  if (tab === "weekly") {
    const now = new Date();
    const week = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );
    return `leaderboard:weekly:${now.getFullYear()}:${week}`;
  }
  return "leaderboard:global";
}

function metaKey(address: string): string {
  return `leaderboard:meta:${address.toLowerCase()}`;
}

export async function getLeaderboard(
  tab: LeaderboardTab,
  limit = 50,
): Promise<LeaderboardEntryRaw[]> {
  const key = keyFor(tab);
  // ZREVRANGE with scores — returns [member, score, member, score, ...]
  const raw = await redis.zrange(key, 0, limit - 1, {
    rev: true,
    withScores: true,
  });

  const entries: LeaderboardEntryRaw[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const address = raw[i] as string;
    const score = Number(raw[i + 1]);
    const meta = await redis.hgetall(metaKey(address));
    entries.push({
      address,
      wins: meta?.wins ? Number(meta.wins) : 0,
      losses: meta?.losses ? Number(meta.losses) : 0,
      totalCelo: score,
    });
  }
  return entries;
}

export async function recordWin(
  address: string,
  celoWon: number,
  tab: LeaderboardTab = "global",
): Promise<void> {
  const key = keyFor(tab);
  const addr = address.toLowerCase();
  await Promise.all([
    redis.zincrby(key, celoWon, addr),
    redis.hincrby(metaKey(addr), "wins", 1),
    redis.zincrby("leaderboard:global", celoWon, addr),
    redis.hincrby(metaKey(addr), "wins", 0), // ensure key exists
  ]);
}

export async function recordLoss(address: string): Promise<void> {
  const addr = address.toLowerCase();
  await redis.hincrby(metaKey(addr), "losses", 1);
}
