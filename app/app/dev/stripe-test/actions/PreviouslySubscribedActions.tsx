import type { MembershipTier } from "@/lib/pricing";
import { handleSubscribe } from "../handlers";

export function PreviouslySubscribedActions({
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
        <h3 className="text-lg font-semibold">Re-Subscribe</h3>
        <p className="text-sm text-gray-600">Your previous subscription has ended. Subscribe again to regain access</p>
      </div>

      <button
        onClick={() => handleSubscribe({ tier: "premium", userEmail, setSelectedTier, setClientSecret })}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Re-subscribe to Premium - $3/month
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Previously subscribed, no active subscription</p>
      </div>
    </div>
  );
}
