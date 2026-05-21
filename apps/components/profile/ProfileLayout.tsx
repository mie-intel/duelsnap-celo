"use client";

interface ProfileLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ProfileLayout({ left, right }: ProfileLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-6">{left}</div>
      <div>{right}</div>
    </div>
  );
}
