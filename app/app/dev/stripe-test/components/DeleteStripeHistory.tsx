import { handleDeleteStripeHistory } from "../handlers";
import styles from "./DeleteStripeHistory.module.css";

interface DeleteStripeHistoryProps {
  userHandle: string;
  refreshUser: () => Promise<void>;
  deletingStripeHistory: boolean;
  setDeletingStripeHistory: (deleting: boolean) => void;
}

export function DeleteStripeHistory({
  userHandle,
  refreshUser,
  deletingStripeHistory,
  setDeletingStripeHistory
}: DeleteStripeHistoryProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Reset Stripe Data</h2>
      <p className={styles.description}>
        Clear all Stripe subscription history for the current user. This will reset the user back to the free tier.
      </p>
      <button
        onClick={() =>
          handleDeleteStripeHistory({
            userHandle,
            refreshUser,
            setDeletingStripeHistory
          })
        }
        disabled={deletingStripeHistory || !userHandle}
        className={styles.button}
      >
        {deletingStripeHistory ? "Deleting..." : "DELETE STRIPE HISTORY"}
      </button>
    </div>
  );
}
