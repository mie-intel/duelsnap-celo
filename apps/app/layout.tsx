import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import DesktopSidebar from "../components/DesktopSidebar";
import Providers from "../components/providers";
import SwipeNav from "../components/SwipeNav";
import { NetworkGuard } from "../components/wallet/NetworkGuard";

export const metadata: Metadata = {
  title: {
    default: "DuelSnap — Picture Duels on Celo",
    template: "%s · DuelSnap",
  },
  description:
    "Guess pictures, win CELO. Play free in casual mode, stake CELO in PvP ranked duels, or contribute photos and earn royalties on-chain. Built on Celo.",
  keywords: [
    "DuelSnap", "Celo blockchain game", "Web3 picture quiz", "PvP crypto game",
    "play to earn", "CELO rewards", "blockchain game", "MiniPay game",
    "photo quiz NFT royalties", "crypto trivia",
  ],
  openGraph: {
    title: "DuelSnap — Guess the Picture. Win CELO.",
    description: "Picture duels on Celo. Play free, stake in PvP, or earn royalties by contributing photos. No signup required.",
    siteName: "DuelSnap",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "DuelSnap logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DuelSnap — Guess the Picture. Win CELO.",
    description: "Picture duels on Celo. Free, Paid, and 1v1 PvP modes. Earn CELO for playing and contributing.",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="talentapp:project_verification" content="a2c74d08cf75355279c9c1b57101bb1485546b6a89e7e40aa920c17b6b902bba3ab12e2d4b1815e5d83f3918f1bfa9a7a374891c2ea5803d01d101315d7b1e6c" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-page">
        <Providers>
          {/* <NetworkGuard /> */}
          <div className="flex flex-1 min-h-screen">
            <DesktopSidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <SwipeNav>{children}</SwipeNav>
              <NavBar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
