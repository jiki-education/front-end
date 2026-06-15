/**
 * (app)-only modal trigger helpers.
 *
 * Most of these helpers need to forward an overlay/modal className to
 * BaseModal so the modal renders with the right chrome (widths, branded
 * backdrops, etc.). The hashed class names come from each modal's own
 * .module.css, so the helper has to import that CSS module to read them.
 *
 * If these helpers lived in ./store.ts (which they used to), store.ts
 * would statically depend on every (app)-only modal's CSS — and store.ts
 * is imported everywhere via useModalStore(), GlobalModalProvider, etc.
 * That meant the (app)-only modal CSS bundled into the global CSS chunk
 * on every route, including blog/articles/landing/premium marketing where
 * the modals never render. PSI flagged ~16 KB of "100% unused CSS" on
 * the blog route from this leak.
 *
 * Splitting them into this file lets the CSS travel with the (app) JS
 * bundle only. Non-(app) callsites should not need any of these — they
 * trigger modals that only make sense post-login (premium upgrade,
 * checkout, payment, exercise completion, avatar, walkthroughs, welcome).
 *
 * Callsites in (app) routes:    import from "@/lib/modal/app"
 * Callsites everywhere else:    import from "@/lib/modal" (core only)
 */

import type { MembershipTier } from "@/lib/pricing";
import type { ModalTrigger } from "@/lib/analytics";
import paymentProcessingStyles from "./modals/PaymentProcessingModal.module.css";
import premiumUpgradeStyles from "./modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import subscriptionCheckoutStyles from "./modals/SubscriptionCheckoutModal.module.css";
import welcomeToPremiumStyles from "./modals/WelcomeToPremiumModal.module.css";
import welcomeStyles from "./modals/WelcomeModal.module.css";
import walkthroughConfirmStyles from "./modals/WalkthroughConfirmModal.module.css";
import avatarEditStyles from "@/components/settings/modals/AvatarEditModal.module.css";
import { showModal } from "./store";

// Convenience function for subscription modals
export const showSubscriptionModal = (props: {
  triggerContext?: "chat-gate" | "feature-gate" | "general" | "settings";
  suggestedTier?: "premium" | "max";
  headline?: string;
  description?: string;
  featuresContext?: {
    feature: string;
    benefits: string[];
  };
  onSuccess?: (tier: MembershipTier) => void;
  onCancel?: () => void;
}) => {
  showModal("subscription-modal", props);
};

// Convenience function for subscription success modals
export const showSubscriptionSuccess = (props: {
  tier: MembershipTier;
  triggerContext?: string;
  nextSteps?: {
    title: string;
    description: string;
    action?: () => void;
    buttonText?: string;
  };
  onClose?: () => void;
}) => {
  showModal("subscription-success-modal", props);
};

// Convenience function for subscription checkout modal
export const showSubscriptionCheckout = (props: {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel?: () => void;
  onSuccess?: () => void;
}) => {
  showModal("subscription-checkout-modal", props, undefined, subscriptionCheckoutStyles.modal);
};

// Convenience function for payment processing modal
export const showPaymentProcessing = (props?: { onClose?: () => void }) => {
  showModal("payment-processing-modal", props ?? {}, undefined, paymentProcessingStyles.modal);
};

// Convenience function for the brief "confirming with Stripe" state shown
// the moment a checkout return is detected, before verifyCheckoutSession resolves.
export const showPaymentConfirming = () => {
  showModal("payment-confirming-modal", {}, undefined, paymentProcessingStyles.modal);
};

// Convenience function shown when checkout verification itself errors
// (network/server failure), distinct from a successful "unpaid" response.
export const showPaymentVerificationFailed = (props?: { onClose?: () => void }) => {
  showModal("payment-verification-failed-modal", props ?? {}, undefined, paymentProcessingStyles.modal);
};

// Convenience function for welcome to premium modal
export const showWelcomeToPremium = (props?: { onClose?: () => void }) => {
  showModal("welcome-to-premium-modal", props ?? {}, undefined, welcomeToPremiumStyles.modal);
};

// Convenience function for the premium upgrade modal. The `trigger` arg is
// typed as `ModalTrigger`, a closed union of allowed values — keep that type
// the single source of truth so the `premium_modal_shown` funnel data stays
// consistent (new triggers must be added to the type before use).
export const showPremiumUpgradeModal = (
  trigger: ModalTrigger,
  options?: {
    contextType?: string;
    contextSlug?: string;
    contextUuid?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
  }
) => {
  showModal(
    "premium-upgrade-modal",
    { trigger, ...options },
    premiumUpgradeStyles.premiumModalOverlay,
    premiumUpgradeStyles.premiumModalWidth
  );
};

// Convenience function for video walkthrough modal
export const showVideoWalkthrough = (props: { playbackId: string; lessonSlug: string }) => {
  showModal("video-walkthrough-modal", props);
};

// Convenience function for walkthrough confirmation modal
export const showWalkthroughConfirm = (props: { onConfirm?: () => void }) => {
  showModal("walkthrough-confirm-modal", props, undefined, walkthroughConfirmStyles.modal);
};

// Convenience function for avatar edit modal
export const showAvatarEditModal = () => {
  showModal("avatar-edit-modal", {}, undefined, avatarEditStyles.modal);
};

// Convenience function for welcome modal (shown once on first signup)
export const showWelcomeModal = () => {
  showModal("welcome-modal", {}, welcomeStyles.overlay, welcomeStyles.modal);
};
