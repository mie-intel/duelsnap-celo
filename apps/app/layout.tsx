import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import Providers from "../components/providers";
import SwipeNav from "../components/SwipeNav";
import { NetworkGuard } from "../components/wallet/NetworkGuard";

export const metadata: Metadata = {
  title: "DuelSnap",
  description:
    "Compete in picture-guessing duels and earn real CELO rewards. Play free, pay to earn, or battle 1v1 in PvP ranked mode on Celo.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-page">
        <Providers>
          {/* <NetworkGuard /> */}
          <SwipeNav>{children}</SwipeNav>
          <NavBar />
        </Providers>
      </body>
    </html>
  );
}
