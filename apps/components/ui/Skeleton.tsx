interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const roundedMap: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className = "", rounded = "lg" }: SkeletonProps) {
  return (
    <div
      className={["animate-pulse bg-surface-2", roundedMap[rounded], className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg-card rounded-2xl">
      <Skeleton className="w-6 h-4" rounded="md" />
      <Skeleton className="w-8 h-8" rounded="full" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-32" rounded="md" />
        <Skeleton className="h-3 w-20" rounded="md" />
      </div>
      <Skeleton className="h-4 w-16" rounded="md" />
    </div>
  );
}

export function ActivityEntrySkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg-card rounded-2xl">
      <Skeleton className="w-9 h-9 shrink-0" rounded="xl" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-40" rounded="md" />
        <Skeleton className="h-3 w-24" rounded="md" />
      </div>
      <Skeleton className="h-4 w-14" rounded="md" />
    </div>
  );
}

export function ProfileStatSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4 bg-bg-card rounded-2xl">
      <Skeleton className="h-3 w-20" rounded="md" />
      <Skeleton className="h-7 w-28" rounded="md" />
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-bg-card rounded-3xl">
      <Skeleton className="h-4 w-36" rounded="md" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton index is stable
          key={i}
          className={["h-3", i === lines - 1 ? "w-3/4" : "w-full"].join(" ")}
          rounded="md"
        />
      ))}
    </div>
  );
}
