export function ActivePremiumActions({
  onUpgradeToMax,
  onCancel,
  onOpenPortal
}: {
  onUpgradeToMax: () => void;
  onCancel: () => void;
  onOpenPortal: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-700">Active Premium</h3>
        <p className="text-sm text-gray-600">Full access to premium features</p>
      </div>

      <button
        onClick={onUpgradeToMax}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Upgrade to Max - $10/month
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
