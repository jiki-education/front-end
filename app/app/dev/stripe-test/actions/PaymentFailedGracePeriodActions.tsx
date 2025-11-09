export function PaymentFailedGracePeriodActions({
  onCancel,
  onOpenPortal
}: {
  onCancel: () => void;
  onOpenPortal: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-700">Payment Failed - Grace Period</h3>
        <p className="text-sm text-gray-600">Update your payment method within 7 days to maintain access</p>
      </div>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
      >
        Update Payment Method
      </button>

      <button
        onClick={onCancel}
        className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
      >
        Cancel Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">You still have access during the grace period</p>
      </div>
    </div>
  );
}
