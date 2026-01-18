"use client";

import styles from "./status-notification.module.css";

interface StatusNotificationProps {
  variant: "warning" | "info" | "error" | "success";
  children: React.ReactNode;
}

export default function StatusNotification({ variant, children }: StatusNotificationProps) {
  return <div className={`${styles.notification} ${styles[variant]}`}>{children}</div>;
}
