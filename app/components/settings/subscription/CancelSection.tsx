import settingsStyles from "../Settings.module.css";
import styles from "./CancelSection.module.css";

interface CancelSectionProps {
  onCancelClick: () => void;
}

export function CancelSection({ onCancelClick }: CancelSectionProps) {
  return (
    <div className={settingsStyles.settingItem}>
      <h3>Cancel Subscription</h3>
      <div className={styles.settingRow}>
        <p>
          If you cancel, you&apos;ll lose access to Premium features at the end of your billing period. You can always
          resubscribe later.
        </p>
        <button className="ui-btn ui-btn-small" onClick={onCancelClick}>
          Cancel
        </button>
      </div>
    </div>
  );
}
