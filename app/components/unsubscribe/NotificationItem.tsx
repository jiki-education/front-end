import { useTranslations } from "next-intl";
import type { EmailPreferences } from "@/lib/api/emailPreferences";
import styles from "./UnsubscribePage.module.css";

export interface NotificationConfig {
  id: keyof EmailPreferences;
}

interface NotificationItemProps {
  config: NotificationConfig;
  enabled: boolean;
  loading: boolean;
  onToggle: () => void;
}

export default function NotificationItem({ config, enabled, loading, onToggle }: NotificationItemProps) {
  const t = useTranslations("unsubscribe");
  const title = t(`types.${config.id}.title`);
  const description = t(`types.${config.id}.description`);
  return (
    <div className={styles.notificationItem}>
      <div className={styles.notificationInfo}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button
        className={`ui-toggle-switch ${enabled ? "active" : ""} ${loading ? "opacity-50" : ""}`}
        onClick={onToggle}
        disabled={loading}
        aria-label={t("toggleAria", { name: title })}
        aria-checked={enabled}
        role="switch"
      />
    </div>
  );
}
