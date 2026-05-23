import Image from "next/image";
import FadeIn from "./FadeIn";

const reasons = [
  {
    title: "MiniPay native",
    body: "Open DuelSnap inside Opera MiniPay and your wallet connects instantly — no popups, no approvals, one tap to play.",
    accent: true,
  },
  {
    title: "Pay fees in cUSD",
    body: "Celo's fee abstraction means users never need to hold CELO just for gas. cUSD covers everything.",
    accent: false,
  },
  {
    title: "Near-zero fees",
    body: "Transactions cost fractions of a cent. Wager 0.1 CELO without losing anything to the network.",
    accent: false,
  },
  {
    title: "EVM compatible",
    body: "MetaMask, Rainbow, WalletConnect — any Ethereum wallet works on day one.",
    accent: false,
  },
];

export default function CeloSection() {
  return (
    <section id="celo" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Celo + MiniPay visual */}
          <FadeIn className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/8 rounded-[3rem] blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 p-10 lg:p-12 rounded-[2.5rem] border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
              {/* Logos row */}
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.png"
                  alt="DuelSnap"
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-text-secondary" aria-hidden="true">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* MiniPay logo mark */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #35D07F 0%, #25A060 100%)" }}>
                  <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9" aria-hidden="true">
                    <path d="M6 26V10l10 12 10-12v16" stroke="#0F001F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <div className="font-display font-bold text-2xl lg:text-3xl text-primary mb-1">
                  DuelSnap × MiniPay
                </div>
                <div className="text-text-secondary text-sm">
                  Celo L1 · Carbon-neutral · Mobile-first
                </div>
              </div>

              {/* MiniPay CTA */}
              <a
                href="https://www.opera.com/mobile/mini"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #35D07F 0%, #25A060 100%)",
                  color: "#0F001F",
                  boxShadow: "0 6px 24px rgba(53,208,127,0.25)",
                }}
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 8a2.5 2.5 0 005 0 2.5 2.5 0 00-5 0z" fill="currentColor" />
                </svg>
                Open in MiniPay
              </a>

              <div className="w-full grid grid-cols-2 gap-3">
                {[
                  { label: "Avg. gas cost", value: "~$0.001" },
                  { label: "Block time", value: "~5s" },
                  { label: "Network", value: "Celo L1" },
                  { label: "Fee tokens", value: "CELO · cUSD" },
                ].map((item) => (
                  <div key={item.label} className="bg-[var(--color-surface-2)] rounded-xl p-3">
                    <div className="font-mono font-bold text-text-primary text-base">{item.value}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: reasons */}
          <FadeIn delay={100} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium text-primary uppercase tracking-widest">
                Why Celo
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary tracking-tight leading-tight">
                The blockchain that doesn't get in the way
              </h2>
            </div>
            <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
              {reasons.map((r) => (
                <div key={r.title} className="py-5 lg:py-6 first:pt-0 flex flex-col gap-1.5">
                  <h3 className={`font-display font-semibold text-base lg:text-lg ${r.accent ? "text-primary" : "text-text-primary"}`}>
                    {r.title}
                    {r.accent && (
                      <span className="ml-2 inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary align-middle">
                        Featured
                      </span>
                    )}
                  </h3>
                  <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-[50ch]">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
