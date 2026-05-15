"use client";

import { PageTabs } from "@/components/ui-kit";
import { Icon } from "@/components/ui-kit/Icon";

export default function UIKitDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-32">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">UI Kit - Components</h1>
          <p className="text-gray-600">This page contains the component styles and examples for the design system.</p>
        </div>

        {/* Page Tabs Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Page Tabs</h2>

          <div className="bg-gray-50 rounded-lg p-24">
            <p className="text-gray-600 text-sm mb-24">
              Horizontal tab navigation for filtering or switching page views. Supports color variants (blue, purple,
              green, gray).
            </p>

            <div className="space-y-32">
              {/* Blue (Default) */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">
                  Blue Active (Default)
                </div>
                <PageTabs
                  tabs={[
                    { id: "all", label: "All", icon: <Icon name="all" size={16} /> },
                    { id: "not-started", label: "Not started", icon: <Icon name="in-progress" size={16} /> }
                  ]}
                  activeTabId="all"
                  onTabChange={() => {}}
                />
              </div>

              {/* Purple */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">Purple Active</div>
                <PageTabs
                  tabs={[
                    {
                      id: "in-progress",
                      label: "In Progress",
                      icon: <Icon name="in-progress" size={16} color="purple" />
                    },
                    { id: "other", label: "Other Tab" }
                  ]}
                  activeTabId="in-progress"
                  onTabChange={() => {}}
                />
              </div>

              {/* Green */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">Green Active</div>
                <PageTabs
                  tabs={[
                    {
                      id: "complete",
                      label: "Complete",
                      icon: <Icon name="complete" size={16} color="green" />,
                      color: "green"
                    },
                    { id: "other2", label: "Other Tab" }
                  ]}
                  activeTabId="complete"
                  onTabChange={() => {}}
                />
              </div>

              {/* Gray */}
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-12">Gray Active</div>
                <PageTabs
                  tabs={[
                    {
                      id: "locked",
                      label: "Locked",
                      icon: <Icon name="locked" size={16} color="gray-500" />,
                      color: "gray"
                    },
                    { id: "other3", label: "Other Tab" }
                  ]}
                  activeTabId="locked"
                  onTabChange={() => {}}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="bg-white rounded-lg shadow-sm mb-32 p-32">
          <h2 className="text-2xl font-semibold mb-32 text-gray-900">Icons</h2>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Default Icons</h3>
            <p className="text-gray-600 text-sm mb-24">
              Icons without color override inherit from parent or use currentColor.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="email" size={24} />
              <Icon name="password" size={24} />
              <Icon name="complete" size={24} />
              <Icon name="in-progress" size={24} />
              <Icon name="locked" size={24} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24 mb-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Custom Colors</h3>
            <p className="text-gray-600 text-sm mb-24">Icons with custom color using Tailwind color classes.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="email" size={24} color="red-500" />
              <Icon name="password" size={24} color="blue-500" />
              <Icon name="complete" size={24} color="orange-500" />
              <Icon name="in-progress" size={24} color="purple-500" />
              <Icon name="locked" size={24} color="gray-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-24">
            <h3 className="text-lg font-semibold mb-8 text-gray-900">Different Sizes</h3>
            <p className="text-gray-600 text-sm mb-24">Icons in various sizes with custom colors.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="email" size={12} color="blue-600" />
              <Icon name="email" size={16} color="blue-600" />
              <Icon name="email" size={20} color="blue-600" />
              <Icon name="email" size={24} color="blue-600" />
              <Icon name="email" size={32} color="blue-600" />
              <Icon name="email" size={40} color="blue-600" />
              <Icon name="email" size={48} color="blue-600" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
