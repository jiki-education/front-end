"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRequireAuth } from "@/lib/auth/hooks";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import toast from "react-hot-toast";
import type { MembershipTier } from "@/lib/pricing";
import SubscriptionSection from "./subscription/SubscriptionSection";
import SubscriptionErrorBoundary from "./subscription/SubscriptionErrorBoundary";
import Sidebar from "@/components/index-page/sidebar/Sidebar";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useRequireAuth();
  const { refreshUser } = useAuthStore();

  // State for checkout flows
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Handle post-payment redirect from Stripe
  useEffect(() => {
    // Only process if user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Extract session_id from URL and remove it (to prevent re-processing on refresh)
    const sessionId = extractAndClearSessionId();

    if (sessionId) {
      // Verify the checkout session with our backend and sync subscription data
      async function verifyAndRefresh(id: string) {
        toast.loading("Verifying payment...");
        const result = await verifyPaymentSession(id);
        toast.dismiss();

        if (result.success) {
          // Payment successful - refresh user data to show new subscription tier
          toast.success("Payment verified! Your subscription has been updated.");
          await refreshUser();
          // Clear checkout state
          setSelectedTier(null);
          setClientSecret(null);
        } else {
          // Payment failed or session invalid
          toast.error(`Failed to verify payment: ${result.error}`);
        }
      }

      void verifyAndRefresh(sessionId);
    }
  }, [isAuthenticated, user, refreshUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary theme-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-secondary theme-transition">
      <Sidebar activeItem="settings" />

      {/* Main Content */}
      <div className="ml-[260px]">
        <main className="p-6">
          <div className="space-y-6">
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
          </div>
        </main>
      </div>
    </div>
  );
}
