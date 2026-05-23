interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  glow?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  style,
  glow = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={[
        "bg-bg-card rounded-2xl shadow-sm p-6",
        onClick
          ? "cursor-pointer hover:shadow-md transition-shadow duration-150"
          : "",
        glow ? "hover:shadow-[0_0_24px_rgba(53,208,127,0.10)] transition-shadow duration-300" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
