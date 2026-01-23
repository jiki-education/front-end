"use client";

import { useState } from "react";
import { getPricingTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import { SubscriptionActionsSwitch } from "./SubscriptionActionsSwitch";
import { UserInfo } from "./UserInfo";
import { DeleteStripeHistory } from "./DeleteStripeHistory";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { CustomerPortal } from "./CustomerPortal";

interface AuthenticatedSectionProps {
  user: User;
  refreshUser: () => Promise<void>;
}

export function AuthenticatedSection({ user, refreshUser }: AuthenticatedSectionProps) {
  const [deletingStripeHistory, setDeletingStripeHistory] = useState(false);

  const currentTier = user.membership_type;

  return (
    <>
      <UserInfo handle={user.handle} email={user.email} membershipTier={currentTier} />

      <DeleteStripeHistory
        userHandle={user.handle}
        refreshUser={refreshUser}
        deletingStripeHistory={deletingStripeHistory}
        setDeletingStripeHistory={setDeletingStripeHistory}
      />

      <SubscriptionStatus user={user} />

      {/* Subscription Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Current Tier: {getPricingTier(currentTier).name}</h2>
        <SubscriptionActionsSwitch user={user} refreshUser={refreshUser} />
      </div>

      {/* Checkout is now handled by the global modal system */}

      <CustomerPortal />
    </>
  );
}
