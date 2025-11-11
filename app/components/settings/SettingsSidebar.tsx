"use client";

import { useRouter } from "next/navigation";

interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function SettingsSidebar({ activeSection, setActiveSection }: SettingsSidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-1/5 bg-bg-primary border-r border-border-primary h-screen sticky top-0 flex flex-col theme-transition">
      {/* Back to Dashboard & Settings Title */}
      <div className="p-6 border-b border-border-primary">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors focus-ring rounded-md px-3 py-2 -mx-3 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setActiveSection("subscription")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors focus-ring font-medium ${
                activeSection === "subscription"
                  ? "bg-button-primary-bg text-button-primary-text"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              }`}
            >
              Subscription
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
