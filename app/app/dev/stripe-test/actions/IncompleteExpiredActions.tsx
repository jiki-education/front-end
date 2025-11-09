import type { MembershipTier } from "@/lib/pricing";

export function IncompleteExpiredActions({ onSubscribe }: { onSubscribe: (tier: MembershipTier) => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Checkout Expired</h3>
        <p className="text-sm text-gray-600">Your previous checkout session expired. Start a new checkout</p>
      </div>

      <button
        onClick={() => onSubscribe("premium")}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Start Fresh Checkout - Premium
      </button>

      <button
        onClick={() => onSubscribe("max")}
        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
      >
        Start Fresh Checkout - Max
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Checkout session abandoned or expired</p>
      </div>
    </div>
  );
}
