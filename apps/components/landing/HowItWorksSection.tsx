import FadeIn from "./FadeIn";

const steps = [
  {
    number: "01",
    title: "Connect or Play Free 🎮",
    body: "No wallet? No problem. Jump into Free Casual mode instantly. Connect MiniPay or any Celo wallet to unlock paid modes and wager real CELO or cUSD.",
    accent: "var(--color-accent-free)",
  },
  {
    number: "02",
    title: "Guess the Picture 🔍",
    body: "Each round shows a real-world image. Pick the correct answer from four options before time runs out — accuracy and speed both matter.",
    accent: "var(--color-accent-paid)",
  },
  {
    number: "03",
    title: "Win & Collect 🏆",
    body: "Beat your opponent in PvP and claim 87% of the wager pool — settled on-chain instantly. Or contribute photos and earn royalties on every future play, forever.",
    accent: "var(--color-accent-pvp)",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <FadeIn className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs font-medium text-primary uppercase tracking-widest">
              How It Works
            </p>
            <span className="text-[9px] font-mono text-text-secondary/40 uppercase tracking-widest">
              · On Celo Mainnet
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-text-primary tracking-tight leading-tight max-w-[18ch]">
            Three steps to your first on-chain win
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border-subtle)] rounded-[2rem] overflow-hidden">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 100}>
              <div className="bg-bg-page px-8 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 flex flex-col gap-4 h-full relative">
                <span
                  className="font-display font-bold text-5xl lg:text-7xl tabular-nums"
                  style={{ color: step.accent }}
                >
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-xl lg:text-2xl text-text-primary tracking-tight">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed max-w-[40ch]">
                  {step.body}
                </p>
                {i < steps.length - 1 && (
                  <span
                    className="hidden md:block absolute top-14 -right-3 text-xl z-10"
                    style={{ color: step.accent }}
                    aria-hidden
                  >
                    →
                  </span>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
