import { NextResponse } from "next/server";

// Faucet disabled on Celo Mainnet — no mock tokens
export async function GET() {
  return NextResponse.json({ cooldownUntil: 0 });
}

export async function POST() {
  return NextResponse.json(
    { error: "Faucet not available on Celo Mainnet. Get CELO from a CEX or bridge." },
    { status: 410 },
  );
}
