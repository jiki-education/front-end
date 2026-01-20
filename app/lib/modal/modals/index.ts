import { ConfirmationModal } from "./ConfirmationModal";
import { ConnectionErrorModal } from "./ConnectionErrorModal";
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
import { FlipBadgeModal } from "./FlipBadgeModal";
import { ChangePasswordModal } from "@/components/settings/modals/ChangePasswordModal";
import { ChangeEmailModal } from "@/components/settings/modals/ChangeEmailModal";
import { PremiumUpgradeModal } from "./PremiumUpgradeModal";

// Export all modals
export {
  ConfirmationModal,
  ConnectionErrorModal,
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
  FlipBadgeModal,
  ChangePasswordModal,
  ChangeEmailModal,
  PremiumUpgradeModal
};

// Available modals registry
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "connection-error-modal": ConnectionErrorModal,
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
  "flip-badge-modal": FlipBadgeModal,
  "change-password-modal": ChangePasswordModal,
  "change-email-modal": ChangeEmailModal,
  "premium-upgrade-modal": PremiumUpgradeModal
};
