"use client";

import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { stripePromise } from "@/lib/stripe";
import type { MembershipTier } from "@/lib/pricing";
import { hideModal } from "../store";
import { ModalBody } from "./SubscriptionCheckoutModal/ModalBody";

interface SubscriptionCheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel?: () => void;
}

export function SubscriptionCheckoutModal({ clientSecret, selectedTier, onCancel }: SubscriptionCheckoutModalProps) {
  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  const appearance = {
    inputs: "condensed" as const,
    labels: "auto" as const,

    variables: {
      fontFamily: '"Poppins", "-apple-system", "system-ui", "Segoe UI", Roboto, sans-serif',
      borderRadius: "10px",
      spacingUnit: "5px",
      fontSmooth: "always",
      colorText: "#343a46", // Should match gray-900
      colorDanger: "#ef4444", // Should match red-900
      gridRowSpacing: "10px"
    },

    rules: {
      ".Tab": {
        borderRadius: "10px"
      },
      ".Tab--selected": {
        borderColor: "#2570eb"
      },
      ".Error": {
        marginTop: "12px",
        fontWeight: "500"
      },
      ".Input": {
        lineHeight: "1"
      }
    }
  };

  const options = {
    clientSecret,
    elementsOptions: {
      fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Poppins" }],
      appearance,
      loader: "always" as const
    }
  };

  return (
    <CheckoutProvider stripe={stripePromise} options={options}>
      <ModalBody selectedTier={selectedTier} onCancel={handleCancel} />
    </CheckoutProvider>
  );
}
