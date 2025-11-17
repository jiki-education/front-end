/**
 * PageTabs Component
 *
 * Horizontal tab navigation for filtering or switching page views.
 * Uses CSS classes from global styles for consistent styling.
 */

import type { PageTabsProps } from "./types";

export function PageTabs({ tabs, activeTabId, onTabChange, className = "", ...props }: PageTabsProps) {
  return (
    <div className={`ui-page-tabs ${className}`.trim()} {...props}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            className={isActive ? "active" : ""}
            data-color={tab.color}
            data-tab={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
