import { handleSubscribe, handleOpenPortal } from "../handlers";

export function PaymentFailedGraceExpiredActions({ userEmail }: { userEmail: string }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-700">Payment Failed - Access Revoked</h3>
        <p className="text-sm text-gray-600">Grace period expired. Update payment or start new subscription</p>
      </div>

      <button
        onClick={handleOpenPortal}
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
      >
        Update Payment Method
      </button>

      <button
        onClick={() => handleSubscribe({ tier: "premium", userEmail })}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Start New Premium Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Downgraded to standard tier</p>
      </div>
    </div>
  );
}
