import React, { type ReactNode } from "react";
import type { TabItem } from "./types";

interface TabRenderProps {
  tab: TabItem;
  isActive: boolean;
  index: number;
  tabProps: {
    id: string;
    role: "tab";
    type: "button";
    "aria-selected": boolean;
    "aria-controls": string;
    className: string;
    onClick: () => void;
  };
}

interface PageTabsRenderProps {
  tabs: TabItem[];
  activeTabId: string;
  containerProps: {
    className: string;
    role: "tablist";
  };
}

interface PageTabsWithRenderPropsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  color?: "blue" | "purple" | "green" | "gray";
  className?: string;
  children: (props: PageTabsRenderProps) => ReactNode;
  renderTab?: (props: TabRenderProps) => ReactNode;
  renderContainer?: (props: { children: ReactNode; className: string }) => ReactNode;
}

export function PageTabsWithRenderProps({
  tabs,
  activeTabId,
  onTabChange,
  color = "blue",
  className,
  children,
  renderTab,
  renderContainer
}: PageTabsWithRenderPropsProps) {
  // Color mapping
  const colorClasses = {
    blue: "text-blue-500 after:bg-blue-500",
    purple: "text-purple-500 after:bg-purple-500",
    green: "text-green-500 after:bg-green-500",
    gray: "text-gray-400 after:bg-gray-400"
  };

  const containerClassName = `flex gap-24 mb-[26px] flex-wrap ${className || ""}`;

  // Default tab renderer
  const defaultTabRenderer = ({ tab, isActive: _isActive, tabProps }: TabRenderProps) => (
    <button {...tabProps}>
      {tab.icon && <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>}
      {tab.label}
    </button>
  );

  // Default container renderer
  const defaultContainerRenderer = ({
    children: containerChildren,
    className: containerClass
  }: {
    children: ReactNode;
    className: string;
  }) => <div className={containerClass}>{containerChildren}</div>;

  const renderProps: PageTabsRenderProps = {
    tabs,
    activeTabId,
    containerProps: {
      className: containerClassName,
      role: "tablist" as const
    }
  };

  const tabElements = tabs.map((tab, index) => {
    const isActive = tab.id === activeTabId;
    const tabColor = tab.color || color;

    const baseTabClasses = `
      py-8 bg-transparent border-none text-[15px] font-normal cursor-pointer font-sans
      relative inline-flex items-center gap-8 transition-colors duration-200 ease-in-out
      text-gray-500 hover:${colorClasses[tabColor].split(" ")[0]}
    `
      .trim()
      .replace(/\s+/g, " ");

    const activeTabClasses = isActive
      ? `${colorClasses[tabColor]} relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-[2px]`
      : "";

    const tabClassName = `${baseTabClasses} ${activeTabClasses}`;

    const tabRenderProps: TabRenderProps = {
      tab,
      isActive,
      index,
      tabProps: {
        id: `tab-${tab.id}`,
        role: "tab" as const,
        type: "button" as const,
        "aria-selected": isActive,
        "aria-controls": `tabpanel-${tab.id}`,
        className: tabClassName,
        onClick: () => onTabChange(tab.id)
      }
    };

    return <div key={tab.id}>{renderTab ? renderTab(tabRenderProps) : defaultTabRenderer(tabRenderProps)}</div>;
  });

  const containerContent = children(renderProps);
  const finalContent = (
    <>
      {tabElements}
      {containerContent}
    </>
  );

  return renderContainer
    ? renderContainer({ children: finalContent, className: containerClassName })
    : defaultContainerRenderer({ children: finalContent, className: containerClassName });
}
