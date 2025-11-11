"use client";

import { useState } from "react";
import { stripePromise } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { getPricingTier } from "@/lib/pricing";
import type { MembershipTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import { handleCheckoutCancel } from "../handlers";
import { CheckoutForm } from "./CheckoutForm";
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
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
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
        <SubscriptionActionsSwitch
          user={user}
          refreshUser={refreshUser}
          setSelectedTier={setSelectedTier}
          setClientSecret={setClientSecret}
        />
      </div>

      {/* Payment Form with Checkout SDK */}
      {clientSecret && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Checkout - {selectedTier && getPricingTier(selectedTier).name}</h2>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              tier={selectedTier!}
              onCancel={() => handleCheckoutCancel({ setClientSecret, setSelectedTier })}
            />
          </Elements>
        </div>
      )}

      <CustomerPortal />
    </>
  );
}
