"use client";

import { useState, useId, type ReactNode } from "react";

interface Tab {
  id: string;
  label: ReactNode;
  /** Badge count to show next to label */
  badge?: number;
  /** Disable this tab */
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  /** Controlled active tab id */
  activeId?: string;
  /** Called when user changes tab */
  onChange?: (id: string) => void;
  /** Default selected tab id (uncontrolled) */
  defaultId?: string;
  children?: ReactNode;
  className?: string;
}

interface TabPanelProps {
  id: string;
  activeId: string;
  children: ReactNode;
}

/**
 * Accessible tab navigation component.
 *
 * @example
 * const [tab, setTab] = useState("overview");
 * <Tabs
 *   tabs={[
 *     { id: "overview", label: "Overview" },
 *     { id: "history", label: "History", badge: 12 },
 *   ]}
 *   activeId={tab}
 *   onChange={setTab}
 * />
 */
export function Tabs({
  tabs,
  activeId: controlledId,
  onChange,
  defaultId,
  className = "",
}: TabsProps) {
  const uid = useId();
  const [internalId, setInternalId] = useState(defaultId ?? tabs[0]?.id ?? "");
  const active = controlledId ?? internalId;

  const handleSelect = (id: string) => {
    setInternalId(id);
    onChange?.(id);
  };

  return (
    <div
      role="tablist"
      aria-label="Navigation tabs"
      className={["flex border-b border-surface-3", className].join(" ")}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            id={`${uid}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`${uid}-panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleSelect(tab.id)}
            className={[
              "relative px-4 py-2.5 text-sm font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-t",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              isActive
                ? "text-primary after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-t"
                : "text-text-muted hover:text-text-primary",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 min-w-[1.25rem] h-5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Panel paired with a Tab — renders only when active.
 *
 * @example
 * <TabPanel id="overview" activeId={tab}>
 *   <OverviewContent />
 * </TabPanel>
 */
export function TabPanel({ id, activeId, children }: TabPanelProps) {
  if (id !== activeId) return null;
  return (
    <div role="tabpanel" aria-labelledby={id}>
      {children}
    </div>
  );
}
