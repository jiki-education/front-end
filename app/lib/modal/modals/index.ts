import { ConfirmationModal } from "./ConfirmationModal";
import { ConnectionErrorModal } from "./ConnectionErrorModal";
import { AuthErrorModal } from "./AuthErrorModal";
import { ExampleModal } from "./ExampleModal";
import { ExerciseSuccessModal } from "./ExerciseSuccessModal";
import { ExerciseCompletionModal } from "./ExerciseCompletionModal";
import { LevelMilestoneModal } from "./LevelMilestoneModal";
import { InfoModal } from "./InfoModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import { RateLimitModal } from "./RateLimitModal";
import { SubscriptionModal } from "./SubscriptionModal";
import { SubscriptionSuccessModal } from "./SubscriptionSuccessModal";
import { SubscriptionCheckoutModal } from "./SubscriptionCheckoutModal";
import { BadgeModal } from "./BadgeModal";
import { ChangePasswordModal } from "@/components/settings/modals/ChangePasswordModal";
import { ChangeEmailModal } from "@/components/settings/modals/ChangeEmailModal";
import { CancelSubscriptionConfirmModal } from "@/components/settings/modals/CancelSubscriptionConfirmModal";
import { CancelSubscriptionSuccessModal } from "@/components/settings/modals/CancelSubscriptionSuccessModal";
import { DeleteAccountModal } from "@/components/settings/modals/DeleteAccountModal";
import { PaymentProcessingModal } from "./PaymentProcessingModal";
import { PremiumUpgradeModal } from "./PremiumUpgradeModal";

// Export all modals
export {
  ConfirmationModal,
  ConnectionErrorModal,
  AuthErrorModal,
  ExampleModal,
  ExerciseSuccessModal,
  ExerciseCompletionModal,
  LevelMilestoneModal,
  InfoModal,
  SessionExpiredModal,
  RateLimitModal,
  SubscriptionModal,
  SubscriptionSuccessModal,
  SubscriptionCheckoutModal,
  BadgeModal,
  ChangePasswordModal,
  ChangeEmailModal,
  CancelSubscriptionConfirmModal,
  CancelSubscriptionSuccessModal,
  DeleteAccountModal,
  PaymentProcessingModal,
  PremiumUpgradeModal
};

// Available modals registry
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "connection-error-modal": ConnectionErrorModal,
  "auth-error-modal": AuthErrorModal,
  "info-modal": InfoModal,
  "exercise-success-modal": ExerciseSuccessModal,
  "exercise-completion-modal": ExerciseCompletionModal,
  "level-milestone-modal": LevelMilestoneModal,
  "session-expired-modal": SessionExpiredModal,
  "rate-limit-modal": RateLimitModal,
  "subscription-modal": SubscriptionModal,
  "subscription-success-modal": SubscriptionSuccessModal,
  "subscription-checkout-modal": SubscriptionCheckoutModal,
  "badge-modal": BadgeModal,
  "change-password-modal": ChangePasswordModal,
  "change-email-modal": ChangeEmailModal,
  "cancel-subscription-confirm-modal": CancelSubscriptionConfirmModal,
  "cancel-subscription-success-modal": CancelSubscriptionSuccessModal,
  "delete-account-modal": DeleteAccountModal,
  "payment-processing-modal": PaymentProcessingModal,
  "premium-upgrade-modal": PremiumUpgradeModal
};
