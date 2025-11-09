export function ActiveMaxActions({
  onDowngradeToPremium,
  onCancel,
  onOpenPortal
}: {
  onDowngradeToPremium: () => void;
  onCancel: () => void;
  onOpenPortal: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-700">Active Max</h3>
        <p className="text-sm text-gray-600">Highest tier with full access</p>
      </div>

      <button
        onClick={onDowngradeToPremium}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Downgrade to Premium - $3/month
      </button>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
      >
        Manage Subscription
      </button>

      <button
        onClick={onCancel}
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
      >
        Cancel Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Tier change happens immediately via API. Cancellation happens at period end.
        </p>
      </div>
    </div>
  );
}
