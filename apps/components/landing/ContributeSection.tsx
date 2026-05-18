import Link from "next/link";
import FadeIn from "./FadeIn";

const steps = [
  {
    step: "1",
    title: "Submit a photo",
    body: "Upload any image you own. Landmark, object, animal, art — anything with a clear answer.",
  },
  {
    step: "2",
    title: "AI verification",
    body: "Our Gemini-powered review checks for quality, uniqueness, and appropriate content. Usually under 60 seconds.",
  },
  {
    step: "3",
    title: "Earn forever",
    body: "Once approved, your photo enters the question pool. Every time it gets played in a Paid session, you collect a royalty — automatically, on-chain.",
  },
];

export default function ContributeSection() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-[var(--color-surface-1)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="rounded-[2.5rem] border border-[var(--color-border-subtle)] bg-bg-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: steps */}
            <FadeIn className="p-10 md:p-14 lg:p-16 flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium text-accent-free uppercase tracking-widest">
                  Contribute
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary tracking-tight leading-tight">
                  Submit photos.
                  <br />
                  Earn royalties forever.
                </h2>
                <p className="text-text-secondary text-base leading-relaxed max-w-[46ch]">
                  Build a passive income stream by contributing questions to the DuelSnap pool.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {steps.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="font-display font-bold text-xs text-primary">
                        {s.step}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display font-semibold text-text-primary text-base">
                        {s.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed max-w-[42ch]">
                        {s.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/contribute"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-text-inverse font-bold text-sm hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card w-fit min-h-[48px]"
              >
                Start Contributing
              </Link>
            </FadeIn>

            {/* Right: royalty breakdown */}
            <FadeIn delay={100} className="border-t md:border-t-0 md:border-l border-[var(--color-border-subtle)] p-10 md:p-14 lg:p-16 flex flex-col gap-6">
              <h3 className="font-display font-bold text-xl text-text-primary">
                Royalty breakdown
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Every Paid Casual session distributes fees across the ecosystem:
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Top scorer pool", pct: "60%", color: "var(--color-accent-paid)" },
                  { label: "Contributors pool", pct: "27%", color: "var(--color-accent-free)" },
                  { label: "Protocol treasury", pct: "13%", color: "var(--color-accent-pvp)" },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{row.label}</span>
                      <span
                        className="font-display font-bold tabular-nums"
                        style={{ color: row.color }}
                      >
                        {row.pct}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: row.pct, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary pt-2 leading-relaxed">
                Contributors split the 27% pool proportionally based on how often
                each photo was played in the session.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
