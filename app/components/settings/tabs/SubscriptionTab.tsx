"use client";

import type { User } from "@/types/auth";
import SubscriptionErrorBoundary from "../subscription/SubscriptionErrorBoundary";
import SubscriptionSection from "../subscription/SubscriptionSection";

interface SubscriptionTabProps {
  user: User | null;
  refreshUser: () => Promise<void>;
}

export default function SubscriptionTab({ user, refreshUser }: SubscriptionTabProps) {
  return (
    <SubscriptionErrorBoundary>
      <SubscriptionSection user={user} refreshUser={refreshUser} />
    </SubscriptionErrorBoundary>
  );
}
