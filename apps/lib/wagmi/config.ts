import { createConfig, http } from "wagmi";
import { celo, chains } from "../chains";

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [celo.id]: http(
      process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org"
    ),
  },
  ssr: true,
});
