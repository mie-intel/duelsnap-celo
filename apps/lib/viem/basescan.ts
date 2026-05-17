export function getBaseScanTxUrl(hash: `0x${string}` | string): string {
  const explorerUrl =
    process.env.NEXT_PUBLIC_CELO_EXPLORER_URL ?? "https://celoscan.io";
  return `${explorerUrl}/tx/${hash}`;
}

export function getBaseScanAddressUrl(address: `0x${string}` | string): string {
  const explorerUrl =
    process.env.NEXT_PUBLIC_CELO_EXPLORER_URL ?? "https://celoscan.io";
  return `${explorerUrl}/address/${address}`;
}
