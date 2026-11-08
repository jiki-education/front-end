"use client";

import { PageTabs } from "@/components/ui-kit";
import AllIcon from "@/icons/all.svg";
import CompleteIcon from "@/icons/complete.svg";
import InProgressIcon from "@/icons/in-progress.svg";
import LockedIcon from "@/icons/locked.svg";
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
                    { id: "all", label: "All", icon: <AllIcon width={16} height={16} /> },
                    { id: "not-started", label: "Not started", icon: <InProgressIcon width={16} height={16} /> }
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
                      icon: <InProgressIcon width={16} height={16} />
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
                      icon: <CompleteIcon width={16} height={16} />,
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
                      icon: <LockedIcon width={16} height={16} />,
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
      </div>
    </div>
  );
}
