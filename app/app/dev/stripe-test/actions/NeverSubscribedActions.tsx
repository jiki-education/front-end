import type { MembershipTier } from "@/lib/pricing";
import { handleSubscribe } from "../handlers";

export function NeverSubscribedActions({
  userEmail,
  setSelectedTier,
  setClientSecret
}: {
  userEmail: string;
  setSelectedTier: (tier: MembershipTier) => void;
  setClientSecret: (secret: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Start Your Subscription</h3>
        <p className="text-sm text-gray-600">Choose a plan to unlock premium features</p>
      </div>

      <button
        onClick={() => handleSubscribe({ tier: "premium", userEmail, setSelectedTier, setClientSecret })}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Subscribe to Premium - $3/month
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">No active subscription</p>
      </div>
    </div>
  );
}
