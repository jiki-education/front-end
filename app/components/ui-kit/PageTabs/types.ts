/**
 * PageTabs Component Types
 */

import type { ReactNode } from "react";
import type { BaseUIProps, ColorVariant } from "../types";

/**
 * Individual tab item
 */
export interface TabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label text
   */
  label: string;

  /**
   * Optional icon for the tab
   */
  icon?: ReactNode;

  /**
   * Color variant for this specific tab when active
   * Overrides the global color prop
   */
  color?: ColorVariant;
}

/**
 * Props for the PageTabs component
 */
export interface PageTabsProps extends BaseUIProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];

  /**
   * ID of the currently active tab
   */
  activeTabId: string;

  /**
   * Callback when a tab is clicked
   */
  onTabChange: (tabId: string) => void;
}
