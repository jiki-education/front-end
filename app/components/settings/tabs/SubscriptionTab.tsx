"use client";

import type { MembershipTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import SubscriptionErrorBoundary from "../subscription/SubscriptionErrorBoundary";
import SubscriptionSection from "../subscription/SubscriptionSection";

interface SubscriptionTabProps {
  user: User | null;
  refreshUser: () => Promise<void>;
  selectedTier: MembershipTier | null;
  setSelectedTier: (tier: MembershipTier | null) => void;
  clientSecret: string | null;
  setClientSecret: (secret: string | null) => void;
}

export default function SubscriptionTab({
  user,
  refreshUser,
  selectedTier,
  setSelectedTier,
  clientSecret,
  setClientSecret,
}: SubscriptionTabProps) {
  return (
    <SubscriptionErrorBoundary>
      <SubscriptionSection
        user={user}
        refreshUser={refreshUser}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        clientSecret={clientSecret}
        setClientSecret={setClientSecret}
      />
    </SubscriptionErrorBoundary>
  );
}