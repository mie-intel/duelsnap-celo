"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { celo } from "../lib/chains";
import { wagmiConfig } from "../lib/wagmi/config";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            loginMethods: ["google", "email", "wallet"],
            defaultChain: celo,
            supportedChains: [celo],
            embeddedWallets: {
              ethereum: { createOnLogin: "users-without-wallets" },
              showWalletUIs: false,
            },
            appearance: {
              walletList: [
                "metamask",
                "rabby_wallet",
                "wallet_connect",
                "coinbase_wallet",
              ],
            },
          }}
        >
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
