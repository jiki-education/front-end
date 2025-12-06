"use client";

import { Suspense } from "react";
import { lazy } from "react";
import type { MembershipTier } from "@/lib/pricing";
import { hideModal } from "../store";

// Import the existing CheckoutModal
const CheckoutModal = lazy(() => import("@/components/settings/subscription/CheckoutModal"));

interface SubscriptionCheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function SubscriptionCheckoutModal({
  clientSecret,
  selectedTier,
  onCancel,
  onSuccess: _onSuccess
}: SubscriptionCheckoutModalProps) {
  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  // Since CheckoutModal renders its own fixed overlay, we need to return a portal-like component
  // The global modal system will try to wrap this in BaseModal, so we need to override that
  // by rendering the CheckoutModal directly and hiding the BaseModal content
  return (
    <>
      {/* Hide the BaseModal backdrop by rendering our checkout modal on top */}
      <div className="hidden">{/* This keeps the modal system happy but doesn't render anything visible */}</div>

      {/* Render the actual checkout modal outside the normal modal flow */}
      <div className="subscription-checkout-overlay">
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal-backdrop">
              <div className="bg-bg-primary p-6 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-center text-text-primary">Loading checkout...</p>
              </div>
            </div>
          }
        >
          <CheckoutModal clientSecret={clientSecret} selectedTier={selectedTier} onCancel={handleCancel} />
        </Suspense>
      </div>
    </>
  );
}
