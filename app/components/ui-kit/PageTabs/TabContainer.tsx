"use client";

import React, { type ReactNode, useState, useCallback } from "react";
import { PageTabs } from "./PageTabs";
import { TabPanel } from "./TabPanel";
import type { TabItem } from "./types";

interface TabContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  children?: ReactNode;
  onChange?: (tabId: string) => void;
  color?: "blue" | "purple" | "green" | "gray";
}

interface TabContainerContextType {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: TabItem[];
}

export const TabContainerContext = React.createContext<TabContainerContextType | null>(null);

export function TabContainer({ tabs, defaultTab, className, children, onChange, color = "blue" }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    },
    [onChange]
  );

  const contextValue = React.useMemo(
    () => ({
      activeTab,
      setActiveTab: handleTabChange,
      tabs
    }),
    [activeTab, handleTabChange, tabs]
  );

  return (
    <TabContainerContext.Provider value={contextValue}>
      <div className={`w-full ${className || ""}`}>
        <PageTabs tabs={tabs} activeTabId={activeTab} onTabChange={handleTabChange} color={color} />
        <div className="mt-24">{children}</div>
      </div>
    </TabContainerContext.Provider>
  );
}

// Hook to access tab container context
export function useTabContainer() {
  const context = React.useContext(TabContainerContext);
  if (!context) {
    throw new Error("useTabContainer must be used within a TabContainer");
  }
  return context;
}

// Compound components
TabContainer.Panel = function TabContainerPanel({
  tabId,
  children,
  className,
  lazy = false
}: {
  tabId: string;
  children: ReactNode;
  className?: string;
  lazy?: boolean;
}) {
  const { activeTab } = useTabContainer();

  return (
    <TabPanel tabId={tabId} activeTabId={activeTab} className={className} lazy={lazy}>
      {children}
    </TabPanel>
  );
};

TabContainer.Content = function TabContainerContent({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`w-full ${className || ""}`}>{children}</div>;
};
