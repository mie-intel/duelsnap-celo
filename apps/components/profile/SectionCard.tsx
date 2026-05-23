"use client";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, children, className = "" }: SectionCardProps) {
  return (
    <div
      className={[
        "bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] p-5 mb-5 transition-shadow hover:shadow-[0_0_20px_rgba(53,208,127,0.06)]",
        className,
      ].join(" ")}
    >
      {title && (
        <h3 className="font-display font-semibold text-sm text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
