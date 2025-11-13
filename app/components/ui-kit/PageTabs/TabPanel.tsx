import React, { type ReactNode } from "react";

interface TabPanelProps {
  children: ReactNode;
  tabId: string;
  activeTabId: string;
  className?: string;
  lazy?: boolean;
}

export function TabPanel({ children, tabId, activeTabId, className, lazy = false }: TabPanelProps) {
  const isActive = tabId === activeTabId;
  const shouldRender = !lazy || isActive;

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      aria-hidden={!isActive}
      className={`focus:outline-none ${isActive ? "block" : "hidden"} ${className || ""}`}
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </div>
  );
}
