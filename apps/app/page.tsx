import type { Metadata } from "next";
import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
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
  title: "DuelSnap — Guess the Picture. Win CELO.",
  description:
    "Picture duels on Celo. Play free in casual mode, stake CELO in PvP ranked duels, or contribute photos and earn royalties on-chain. No signup required.",
  keywords: ["celo", "blockchain game", "picture quiz", "crypto game", "pvp", "play to earn", "minipay"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DuelSnap — Guess the Picture. Win CELO.",
    description: "Picture duels on Celo. Play free or wager CELO in PvP ranked matches.",
    type: "website",
    locale: "en_US",
  },
};

export default function LandingPage() {
  return (
    <div className="w-full min-h-[100dvh] bg-bg-page">
      <LandingNav />
      <HeroSection />
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
