"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabPanelProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  className?: string;
}

export default function TabPanel({ tabs, defaultActiveTab, className = "" }: TabPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || "");

  if (tabs.length === 0) {
    return null;
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">{activeTabContent}</div>
    </div>
  );
}