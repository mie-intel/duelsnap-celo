"use client";

export interface FilterState {
  result: "all" | "win" | "lose";
  mode: "all" | "free" | "casual" | "competitive";
  dateRange: "all" | "week" | "month";
}

interface MatchFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

interface PillGroupProps<T extends string> {
  options: { value: T; label: string }[];
  active: T;
  onSelect: (v: T) => void;
}

function PillGroup<T extends string>({ options, active, onSelect }: PillGroupProps<T>) {
  return (
    <>
      {options.map(({ value, label }) => {
        const isActive = value === active;
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all"
            style={
              isActive
                ? {
                    backgroundColor: "rgba(53,208,127,0.20)",
                    color: "var(--color-primary)",
                    borderColor: "rgba(53,208,127,0.40)",
                  }
                : {
                    backgroundColor: "rgba(248,243,235,0.04)",
                    color: "var(--color-text-secondary)",
                    borderColor: "var(--color-border-subtle)",
                  }
            }
          >
            {label}
          </button>
        );
      })}
    </>
  );
}

export default function MatchFilters({ filters, onChange }: MatchFiltersProps) {
  return (
    <div className="mb-4 space-y-2">
      {/* Result filter */}
      <div className="overflow-x-auto flex gap-2 pb-1">
        <span className="shrink-0 text-[10px] font-sans text-[var(--color-text-secondary)] self-center pr-1 uppercase tracking-wider">
          Result
        </span>
        <PillGroup
          options={[
            { value: "all", label: "All" },
            { value: "win", label: "Win" },
            { value: "lose", label: "Loss" },
          ]}
          active={filters.result}
          onSelect={(result) => onChange({ ...filters, result })}
        />
      </div>

      {/* Mode filter */}
      <div className="overflow-x-auto flex gap-2 pb-1">
        <span className="shrink-0 text-[10px] font-sans text-[var(--color-text-secondary)] self-center pr-1 uppercase tracking-wider">
          Mode
        </span>
        <PillGroup
          options={[
            { value: "all", label: "All" },
            { value: "free", label: "Free" },
            { value: "casual", label: "Casual" },
            { value: "competitive", label: "PvP" },
          ]}
          active={filters.mode}
          onSelect={(mode) => onChange({ ...filters, mode })}
        />
      </div>

      {/* Date filter */}
      <div className="overflow-x-auto flex gap-2 pb-1">
        <span className="shrink-0 text-[10px] font-sans text-[var(--color-text-secondary)] self-center pr-1 uppercase tracking-wider">
          Date
        </span>
        <PillGroup
          options={[
            { value: "all", label: "All" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
          active={filters.dateRange}
          onSelect={(dateRange) => onChange({ ...filters, dateRange })}
        />
      </div>
    </div>
  );
}
