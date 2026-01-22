import { getPricingTier } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";

interface UserInfoProps {
  handle: string;
  email: string;
  membershipTier: MembershipTier;
}

export function UserInfo({ handle, email, membershipTier }: UserInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Current User</h2>
      <dl className="space-y-2">
        <div>
          <dt className="inline font-medium">Handle:</dt>
          <dd className="inline ml-2">{handle}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Email:</dt>
          <dd className="inline ml-2">{email}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Membership Tier:</dt>
          <dd className="inline ml-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierBadgeColor(membershipTier)}`}>
              {getPricingTier(membershipTier).name}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function getTierBadgeColor(tier: MembershipTier): string {
  switch (tier) {
    case "standard":
      return "bg-gray-100 text-gray-800";
    case "premium":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
