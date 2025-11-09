export function CancellingScheduledActions({ onReactivate }: { onReactivate: () => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-orange-700">Cancellation Scheduled</h3>
        <p className="text-sm text-gray-600">Your subscription will end at the current period end</p>
      </div>

      <button
        onClick={onReactivate}
        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
      >
        Resume Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">You keep access until period end. Resume happens immediately via API.</p>
      </div>
    </div>
  );
}
