"use client";

import { useAuthStore } from "../../lib/auth/authStore";
import { ExternalFooter } from "./ExternalFooter";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import styles from "./SidebarLayout.module.css";

interface SidebarLayoutProps {
  activeItem: string;
  children: React.ReactNode;
}

export default function SidebarLayout({ activeItem, children }: SidebarLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return (
      <div className={styles.appShell}>
        <Sidebar activeItem={activeItem} />
        <main className={styles.main}>{children}</main>
      </div>
    );
  }
  return (
    <div className={styles.externalShell}>
      <Header />
      <main className={styles.externalMain}>{children}</main>
      <ExternalFooter />
    </div>
  );
}
