/**
 * PageTabs Component
 *
 * Horizontal tab navigation for filtering or switching page views.
 * Supports color variants (blue, purple, green, gray) and icons.
 */

import type { PageTabsProps, TabItem } from "./types";
import type { ColorVariant } from "../types";

export function PageTabs({ tabs, activeTabId, onTabChange, color = "blue", className = "", ...props }: PageTabsProps) {
  const containerClasses = ["flex gap-24 mb-[26px] flex-wrap", className].filter(Boolean).join(" ");

  // Color variant classes for active states
  const getColorClasses = (variant: ColorVariant) => {
    const colorMap = {
      blue: {
        text: "text-blue-500",
        border: "after:bg-blue-500"
      },
      purple: {
        text: "text-purple-500",
        border: "after:bg-purple-500"
      },
      green: {
        text: "text-green-500",
        border: "after:bg-green-500"
      },
      gray: {
        text: "text-gray-400",
        border: "after:bg-gray-400"
      }
    };

    return colorMap[variant];
  };

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    const tabColor = tab.color || color;
    const colorClasses = getColorClasses(tabColor);

    return [
      // Base styles
      "py-8 bg-transparent border-none text-[15px] font-normal cursor-pointer",
      "font-sans relative inline-flex items-center gap-8",
      "transition-colors duration-200 ease-in-out",

      // Default color
      "text-gray-500",

      // Hover state
      "hover:text-blue-500",

      // Active state
      isActive && [
        colorClasses.text,
        "relative",
        // Active underline
        'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0',
        "after:h-[2px] after:rounded-[2px]",
        colorClasses.border
      ]
    ]
      .flat()
      .filter(Boolean)
      .join(" ");
  };

  const iconClasses = "w-4 h-4 flex-shrink-0";

  return (
    <div className={containerClasses} {...props}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            className={getTabClasses(tab, isActive)}
            onClick={() => onTabChange(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.icon && <span className={iconClasses}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
