"use client";

import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { CloseButton } from "@/components/ui-kit";
import { stripePromise } from "@/lib/stripe";
import { staticAsset } from "@/lib/static-asset";
import type { MembershipTier } from "@/lib/pricing";
import { hideModal } from "../store";
import { ModalBody } from "./PremiumCheckoutModal/ModalBody";
import modalStyles from "@/app/styles/components/modals.module.css";

interface PremiumCheckoutModalProps {
  clientSecret: string;
  selectedTier: MembershipTier;
  priorError?: string | null;
  onCancel?: () => void;
}

export function PremiumCheckoutModal({ clientSecret, selectedTier, priorError, onCancel }: PremiumCheckoutModalProps) {
  // Hides first, so onCancel can open the modal this one replaced
  const handleCancel = () => {
    hideModal();
    onCancel?.();
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
      fonts: stripeFonts(),
      appearance,
      loader: "always" as const
    }
  };

  return (
    <CheckoutProvider stripe={stripePromise} options={options}>
      <ModalBody selectedTier={selectedTier} priorError={priorError} onCancel={handleCancel} />
      {/* Our own close button, as BaseModal's would hide the modal without calling onCancel */}
      <div className={modalStyles.modalCloseButton}>
        <CloseButton onClick={handleCancel} variant="light" />
      </div>
    </CheckoutProvider>
  );
}

const POPPINS_WEIGHTS = ["400", "500", "600"] as const;

// Stripe renders the payment fields in iframes on js.stripe.com, so our
// next/font copy of Poppins doesn't reach them and Stripe has to load the
// files itself. We give it our own copies on assets.jiki.io, which allows
// cross-origin font loads. Development has no https asset host, and Stripe's
// https iframe would block an http font as mixed content, so dev falls back to
// the system fonts listed after Poppins in the appearance.
function stripeFonts() {
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  return POPPINS_WEIGHTS.map((weight) => ({
    family: "Poppins",
    src: `url(${staticAsset(`fonts/poppins-latin-${weight}.woff2`)})`,
    weight,
    display: "swap" as const
  }));
}
