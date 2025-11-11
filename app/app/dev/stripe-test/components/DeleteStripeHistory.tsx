import { handleDeleteStripeHistory } from "../handlers";

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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Reset Stripe Data</h2>
      <p className="text-sm text-gray-600 mb-4">
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
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deletingStripeHistory ? "Deleting..." : "DELETE STRIPE HISTORY"}
      </button>
    </div>
  );
}
