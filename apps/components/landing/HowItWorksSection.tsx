export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect or Play Free",
      body: "No wallet? No problem. Jump into Free Casual mode instantly. Connect MiniPay or any Celo wallet to unlock paid modes.",
      accent: "var(--color-accent-free)",
    },
    {
      number: "02",
      title: "Guess the Picture",
      body: "Each round shows a blurred or cropped image. Pick the correct answer from four options before time runs out.",
      accent: "var(--color-accent-paid)",
    },
    {
      number: "03",
      title: "Win & Collect",
      body: "Beat your opponent in PvP and claim 87% of the wager pool. Earn royalties every time your contributed photo gets played.",
      accent: "var(--color-accent-pvp)",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16 md:mb-20">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-text-primary tracking-tight leading-tight max-w-[18ch]">
            Three steps to your first CELO win
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border-subtle)] rounded-[2rem] overflow-hidden">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-bg-page px-8 py-10 md:px-10 md:py-12 flex flex-col gap-4"
            >
              <span
                className="font-display font-bold text-5xl tabular-nums"
                style={{ color: step.accent }}
              >
                {step.number}
              </span>
              <h3 className="font-display font-bold text-xl text-text-primary tracking-tight">
                {step.title}
              </h3>
              <p className="text-text-secondary text-base leading-relaxed max-w-[40ch]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
