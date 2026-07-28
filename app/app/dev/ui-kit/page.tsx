"use client";

import { PageTabs } from "@/components/ui-kit";
import { Icon } from "@/components/ui-kit/Icon";
import styles from "./page.module.css";

export default function UIKitDemoPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>UI Kit - Components</h1>
          <p className={styles.intro}>This page contains the component styles and examples for the design system.</p>
        </div>

        {/* Page Tabs Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Page Tabs</h2>

          <div className={styles.panel}>
            <p className={styles.panelDescription}>
              Horizontal tab navigation for filtering or switching page views. Supports color variants (blue, purple,
              green, gray).
            </p>

            <div className={styles.tabGroups}>
              {/* Blue (Default) */}
              <div>
                <div className={styles.variantLabel}>Blue Active (Default)</div>
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
                <div className={styles.variantLabel}>Purple Active</div>
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
                <div className={styles.variantLabel}>Green Active</div>
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
                <div className={styles.variantLabel}>Gray Active</div>
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
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Icons</h2>

          <div className={styles.panelSpaced}>
            <h3 className={styles.panelTitle}>Default Icons</h3>
            <p className={styles.panelDescription}>
              Icons without color override inherit from parent or use currentColor.
            </p>
            <div className={styles.iconRow}>
              <Icon name="email" size={24} />
              <Icon name="password" size={24} />
              <Icon name="complete" size={24} />
              <Icon name="in-progress" size={24} />
              <Icon name="locked" size={24} />
            </div>
          </div>

          <div className={styles.panelSpaced}>
            <h3 className={styles.panelTitle}>Custom Colors</h3>
            <p className={styles.panelDescription}>Icons with custom color using Tailwind color classes.</p>
            <div className={styles.iconRow}>
              <Icon name="email" size={24} color="red-500" />
              <Icon name="password" size={24} color="blue-500" />
              <Icon name="complete" size={24} color="orange-500" />
              <Icon name="in-progress" size={24} color="purple-500" />
              <Icon name="locked" size={24} color="gray-500" />
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Different Sizes</h3>
            <p className={styles.panelDescription}>Icons in various sizes with custom colors.</p>
            <div className={styles.iconRow}>
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
