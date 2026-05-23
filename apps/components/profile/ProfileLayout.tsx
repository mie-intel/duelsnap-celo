"use client";

interface ProfileLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ProfileLayout({ left, right }: ProfileLayoutProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
          Celo Mainnet · Chain 42220
        </span>
      </div>
      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 lg:items-start">
        <div className="lg:sticky lg:top-6">{left}</div>
        <div>{right}</div>
      </div>
    </>
  );
}
