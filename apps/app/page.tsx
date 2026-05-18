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
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-bg-page">
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
