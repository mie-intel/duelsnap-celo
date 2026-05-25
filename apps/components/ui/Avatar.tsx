import { useMemo } from "react";

interface AvatarProps {
  address?: string;
  name?: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
} as const;

/** Deterministic color from address or name */
function colorFromSeed(seed: string): string {
  const palette = [
    "bg-[#4f46e5]", // indigo
    "bg-[#0891b2]", // cyan
    "bg-[#059669]", // emerald
    "bg-[#d97706]", // amber
    "bg-[#dc2626]", // red
    "bg-[#7c3aed]", // violet
    "bg-[#db2777]", // pink
    "bg-[#65a30d]", // lime
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

function initials(name?: string, address?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (address) return address.slice(2, 4).toUpperCase();
  return "??";
}

/**
 * User avatar with image, initials, or address-based fallback.
 *
 * @example
 * <Avatar address="0xabc..." size="md" />
 * <Avatar name="Alice" src="/avatar.png" size="lg" />
 */
export function Avatar({ address, name, src, size = "md", className = "" }: AvatarProps) {
  const seed = address ?? name ?? "anon";
  const color = useMemo(() => colorFromSeed(seed), [seed]);
  const label = initials(name, address);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? address ?? "Avatar"}
        className={[
          "rounded-full object-cover shrink-0 ring-2 ring-border-subtle",
          SIZES[size],
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <div
      aria-label={name ?? address ?? "User avatar"}
      className={[
        "rounded-full shrink-0 flex items-center justify-center font-bold text-white font-mono ring-2 ring-border-subtle select-none",
        SIZES[size],
        color,
        className,
      ].join(" ")}
    >
      {label}
    </div>
  );
}
