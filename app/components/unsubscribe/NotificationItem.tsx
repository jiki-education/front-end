import type { EmailPreferences } from "@/lib/api/emailPreferences";
import styles from "./UnsubscribePage.module.css";

export interface NotificationConfig {
  id: keyof EmailPreferences;
  title: string;
  description: string;
}

interface NotificationItemProps {
  config: NotificationConfig;
  enabled: boolean;
  loading: boolean;
  onToggle: () => void;
}

export default function NotificationItem({ config, enabled, loading, onToggle }: NotificationItemProps) {
  return (
    <div className={styles.notificationItem}>
      <div className={styles.notificationInfo}>
        <h3>{config.title}</h3>
        <p>{config.description}</p>
      </div>
      <button
        className={`ui-toggle-switch ${enabled ? "active" : ""} ${loading ? "opacity-50" : ""}`}
        onClick={onToggle}
        disabled={loading}
        aria-label={`Toggle ${config.title}`}
        aria-checked={enabled}
        role="switch"
      />
    </div>
  );
}
