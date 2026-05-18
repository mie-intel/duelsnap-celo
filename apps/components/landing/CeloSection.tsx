import Image from "next/image";

const reasons = [
  {
    title: "Near-zero fees",
    body: "Celo transactions cost fractions of a cent. Wager 0.1 CELO without losing half to gas.",
  },
  {
    title: "Pay fees in stablecoins",
    body: "Celo's fee abstraction lets users pay gas in cUSD or cEUR — no need to hold CELO just for gas.",
  },
  {
    title: "Mobile-first by design",
    body: "MiniPay and Valora make signing transactions as fast as a tap. DuelSnap is built for that flow.",
  },
  {
    title: "EVM compatible",
    body: "Any Ethereum wallet works. MetaMask, Rainbow, WalletConnect — connect once, play anywhere.",
  },
];

export default function CeloSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Celo visual */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/8 rounded-[3rem] blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 p-12 rounded-[2.5rem] border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
              <Image
                src="/logo.png"
                alt="DuelSnap on Celo"
                width={80}
                height={80}
                className="rounded-2xl"
              />
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-primary mb-1">
                  Built on Celo
                </div>
                <div className="text-text-secondary text-sm">
                  Carbon-neutral · EVM-compatible · Mobile-first
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Avg. gas cost", value: "~$0.001" },
                  { label: "Block time", value: "~5s" },
                  { label: "Network", value: "Celo L1" },
                  { label: "Fee tokens", value: "CELO / cUSD" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[var(--color-surface-2)] rounded-xl p-3"
                  >
                    <div className="font-mono font-bold text-text-primary text-base">
                      {item.value}
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: reasons */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium text-primary uppercase tracking-widest">
                Why Celo
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary tracking-tight leading-tight">
                The blockchain that doesn't get in the way
              </h2>
            </div>
            <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
              {reasons.map((r) => (
                <div key={r.title} className="py-5 first:pt-0 flex flex-col gap-1.5">
                  <h3 className="font-display font-semibold text-base text-text-primary">
                    {r.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-[50ch]">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
