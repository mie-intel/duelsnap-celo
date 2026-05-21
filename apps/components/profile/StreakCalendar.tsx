"use client";

import type { GameLogEntry } from "../../hooks/usePlayerLog";

interface StreakCalendarProps {
  entries: GameLogEntry[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDayColor(count: number): string {
  if (count === 0) return "bg-[rgba(248,243,235,0.04)]";
  if (count === 1) return "bg-[var(--color-primary)]/20";
  if (count === 2) return "bg-[var(--color-primary)]/40";
  return "bg-[var(--color-primary)]/70";
}

function getInlineColor(count: number): string {
  if (count === 0) return "rgba(248,243,235,0.04)";
  if (count === 1) return "rgba(53,208,127,0.2)";
  if (count === 2) return "rgba(53,208,127,0.4)";
  return "rgba(53,208,127,0.7)";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function StreakCalendar({ entries }: StreakCalendarProps) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Build 35 days (5 weeks) array, ending today
  const days: Date[] = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // Count games per calendar day
  const countsByDay = new Map<string, number>();
  for (const entry of entries) {
    const d = new Date(entry.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  // Month label: span of days[0] to days[34]
  const startMonth = days[0].toLocaleDateString("en-US", { month: "short" });
  const endMonth = days[34].toLocaleDateString("en-US", { month: "short" });
  const monthLabel = startMonth === endMonth ? startMonth : `${startMonth} – ${endMonth}`;

  // Arrange by week rows: days[0..6] = week1, etc. (Mon-based)
  // days array is already 35 elements, map to 5 rows × 7 cols
  // Days 0..34: index % 7 = column (Mon=0..Sun=6)
  const weeks: Date[][] = [];
  for (let w = 0; w < 5; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm text-[var(--color-text-secondary)] uppercase tracking-widest">
          Activity Streak
        </h3>
        <span className="text-[var(--color-text-secondary)] text-xs font-sans">{monthLabel}</span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[9px] font-sans text-[var(--color-text-secondary)]"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid: 5 rows × 7 cols */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
              const count = countsByDay.get(key) ?? 0;
              const label = `${formatDate(day)}: ${count} game${count !== 1 ? "s" : ""}`;
              return (
                <div
                  key={di}
                  title={label}
                  className="w-8 h-8 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: getInlineColor(count) }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[var(--color-text-secondary)] text-[10px] font-sans">Less</span>
        {[0, 1, 2, 3].map((level) => (
          <div
            key={level}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getInlineColor(level) }}
          />
        ))}
        <span className="text-[var(--color-text-secondary)] text-[10px] font-sans">More</span>
      </div>
    </div>
  );
}
