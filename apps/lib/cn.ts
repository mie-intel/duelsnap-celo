/**
 * Class name merge utility — combines conditional class names.
 * Lightweight alternative to clsx/classnames, no dependency needed.
 *
 * @example
 * cn("base", isActive && "active", error ? "text-red" : "text-green")
 * // → "base active text-red"
 *
 * cn("btn", { "btn-primary": isPrimary, "btn-disabled": isDisabled })
 * // → "btn btn-primary"
 */
export function cn(
  ...inputs: Array<
    string | undefined | null | false | Record<string, boolean | undefined | null>
  >
): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}
