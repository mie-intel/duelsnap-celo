export function parseContractError(e: unknown): string {
  const rawMsg = e instanceof Error ? e.message : String(e);

  // Extract inner revert reason if wrapped (e.g. viem ContractFunctionRevertedError)
  const innerMatch =
    rawMsg.match(/reverted with the following reason:\s*(.+)/i) ??
    rawMsg.match(/revert reason:\s*(.+)/i);
  const msg = innerMatch ? innerMatch[1].trim() : rawMsg;

  // User rejection — not an error
  if (/user rejected|user denied|rejected by user|4001/i.test(rawMsg)) {
    return "Transaction rejected.";
  }

  if (
    /Unexpected non-whitespace character after JSON|Unexpected token.*JSON|JSON\.parse/i.test(
      rawMsg,
    )
  ) {
    return "Network RPC returned a malformed response. Please retry the transaction.";
  }

  if (/NothingToWithdraw/i.test(rawMsg) || /NothingToWithdraw/i.test(msg)) {
    return "Escrow is already empty. Refresh the page and try again.";
  }

  // Gas / native token balance
  if (
    /Signer had insufficient balance|insufficient funds for gas|total cost.*exceeds.*balance|gas.*exceeds.*balance|out of gas|gas too low/i.test(
      rawMsg,
    )
  ) {
    return "Not enough CELO for gas. Get CELO from a CEX or bridge (app.celo.org/bridge).";
  }

  // Wrong wallet network
  if (
    /current chain of the wallet.*does not match the target chain|does not match the target chain|wallet_switchEthereumChain|wallet_addEthereumChain/i.test(
      rawMsg,
    )
  ) {
    return "Wrong network. Switch your wallet to Celo Mainnet and try again.";
  }

  // Native CELO balance
  if (
    /WrongFee|wrong fee|insufficient CELO/i.test(msg) ||
    /WrongFee/i.test(rawMsg)
  ) {
    return "Wrong fee amount sent. Please try again.";
  }

  // Truncate long unknown errors
  const display = msg.length > 120 ? `${msg.slice(0, 120)}...` : msg;
  return display;
}
