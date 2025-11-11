import { handleOpenPortal } from "../handlers";

export function CustomerPortal() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Update Payment Details</h2>
      <p className="text-sm text-gray-600 mb-4">
        Open the Stripe Customer Portal to update payment methods, view invoices subscriptions.
      </p>
      <button onClick={handleOpenPortal} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Open Customer Portal
      </button>
    </div>
  );
}
