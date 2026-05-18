interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
}

export default function SectionLabel({ children, color = "var(--color-primary)" }: SectionLabelProps) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-widest"
      style={{ color }}
    >
      {children}
    </p>
  );
}
