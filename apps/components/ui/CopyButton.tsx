"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: "sm" | "md" | "icon";
  variant?: "button" | "ghost" | "link";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  icon: "p-2 rounded-xl",
};

const VARIANT_CLASSES = {
  button:
    "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-black/5",
  link: "text-primary hover:underline p-0",
};

/**
 * One-click copy-to-clipboard button with animated feedback.
 * Wraps `useCopyToClipboard` into a ready-to-use component.
 *
 * @example
 * <CopyButton text={walletAddress} label="Copy address" />
 * <CopyButton text={referralLink} size="icon" />
 * <CopyButton text={txHash} variant="ghost" label="Copy tx" />
 */
export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  size = "md",
  variant = "button",
  className = "",
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={[
        "inline-flex items-center font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "active:scale-95 select-none",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      ].join(" ")}
    >
      {/* Icon */}
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 shrink-0 text-success"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
          <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
        </svg>
      )}

      {/* Label — hidden in icon-only mode */}
      {size !== "icon" && (
        <span className={copied ? "text-success" : ""}>
          {copied ? copiedLabel : label}
        </span>
      )}
    </button>
  );
}
