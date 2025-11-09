import type { MembershipTier } from "@/lib/pricing";

export function PaymentFailedGraceExpiredActions({
  onOpenPortal,
  onSubscribe
}: {
  onOpenPortal: () => void;
  onSubscribe: (tier: MembershipTier) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-700">Payment Failed - Access Revoked</h3>
        <p className="text-sm text-gray-600">Grace period expired. Update payment or start new subscription</p>
      </div>

      <button
        onClick={onOpenPortal}
        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
      >
        Update Payment Method
      </button>

      <button
        onClick={() => onSubscribe("premium")}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Start New Premium Subscription
      </button>

      <button
        onClick={() => onSubscribe("max")}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Start New Max Subscription
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Downgraded to standard tier</p>
      </div>
    </div>
  );
}
