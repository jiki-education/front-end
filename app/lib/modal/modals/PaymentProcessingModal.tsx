"use client";

import { hideModal } from "../store";
import type { MembershipTier } from "@/lib/pricing";

interface PaymentProcessingModalProps {
  tier: MembershipTier;
  onClose?: () => void;
}

export function PaymentProcessingModal({ tier, onClose }: PaymentProcessingModalProps) {
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div>
      <h2>Payment Processing</h2>
      <p>
        We&apos;re waiting for your payment provider to send us the funds. Once they do we&apos;ll upgrade your account
        to {tier} and send you an email.
      </p>
      <button onClick={handleClose}>Got it</button>
    </div>
  );
}
