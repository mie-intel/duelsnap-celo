import { NextRequest, NextResponse } from "next/server";
import {
  getLeaderboard,
  type LeaderboardTab,
} from "../../../lib/redis/leaderboard";

export const runtime = "edge";
export const revalidate = 60; // ISR: revalidate every 60s

export async function GET(req: NextRequest) {
  const tab = (req.nextUrl.searchParams.get("tab") ?? "global") as LeaderboardTab;

  if (tab !== "global" && tab !== "weekly") {
    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  }

  try {
    const entries = await getLeaderboard(tab, 50);
    return NextResponse.json({ entries, tab }, { status: 200 });
  } catch (err) {
    console.error("[leaderboard] fetch failed:", err);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
