import type { Metadata } from "next";
import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import { ActivityTicker } from "../components/landing/ActivityTicker";
import StatsSection from "../components/landing/StatsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import GameModesSection from "../components/landing/GameModesSection";
import EarnSection from "../components/landing/EarnSection";
import ContributeSection from "../components/landing/ContributeSection";
import CeloSection from "../components/landing/CeloSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "DuelSnap — MiniPay Picture Duels on Celo",
  description:
    "MiniPay-ready picture duels on Celo Mainnet. Play free, stake CELO in PvP ranked duels, or contribute photos and earn royalties on-chain.",
  keywords: ["celo", "cUSD", "MiniPay", "blockchain game", "picture quiz", "crypto game", "pvp", "play to earn"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DuelSnap — MiniPay Picture Duels on Celo",
    description: "MiniPay-ready picture duels on Celo Mainnet with free, paid casual, and 1v1 PvP modes.",
    type: "website",
    locale: "en_US",
  },
};

export default function LandingPage() {
  return (
    <div className="w-full min-h-[100dvh] bg-bg-page">
      <LandingNav />
      <HeroSection />
      <ActivityTicker />
      <StatsSection />
      <HowItWorksSection />
      <GameModesSection />
      <EarnSection />
      <ContributeSection />
      <CeloSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
