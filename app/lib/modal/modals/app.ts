import dynamic from "next/dynamic";

// (app)-only modals: triggered exclusively from authenticated routes
// (exercise flows, premium upgrade, subscription/payment, settings,
// badges, welcome). Registered by (app)/layout.tsx via AppModalRegistrar
// so the corresponding JS chunks aren't shipped to /blog, /articles,
// /, /premium etc.

const ExerciseSuccessModal = dynamic(() => import("./ExerciseSuccessModal").then((m) => m.ExerciseSuccessModal));
const ExerciseCompletionModal = dynamic(() =>
  import("./ExerciseCompletionModal").then((m) => m.ExerciseCompletionModal)
);
const LevelMilestoneModal = dynamic(() => import("./LevelMilestoneModal").then((m) => m.LevelMilestoneModal));
const SubscriptionModal = dynamic(() => import("./SubscriptionModal").then((m) => m.SubscriptionModal));
const SubscriptionSuccessModal = dynamic(() =>
  import("./SubscriptionSuccessModal").then((m) => m.SubscriptionSuccessModal)
);
const SubscriptionCheckoutModal = dynamic(() =>
  import("./SubscriptionCheckoutModal").then((m) => m.SubscriptionCheckoutModal)
);
const BadgeModal = dynamic(() => import("./BadgeModal").then((m) => m.BadgeModal));
const ChangePasswordModal = dynamic(() =>
  import("@/components/settings/modals/ChangePasswordModal").then((m) => m.ChangePasswordModal)
);
const ChangeEmailModal = dynamic(() =>
  import("@/components/settings/modals/ChangeEmailModal").then((m) => m.ChangeEmailModal)
);
const CancelSubscriptionConfirmModal = dynamic(() =>
  import("@/components/settings/modals/CancelSubscriptionConfirmModal").then((m) => m.CancelSubscriptionConfirmModal)
);
const CancelSubscriptionSuccessModal = dynamic(() =>
  import("@/components/settings/modals/CancelSubscriptionSuccessModal").then((m) => m.CancelSubscriptionSuccessModal)
);
const DeleteAccountModal = dynamic(() =>
  import("@/components/settings/modals/DeleteAccountModal").then((m) => m.DeleteAccountModal)
);
const AvatarEditModal = dynamic(() =>
  import("@/components/settings/modals/AvatarEditModal").then((m) => m.AvatarEditModal)
);
const PaymentProcessingModal = dynamic(() => import("./PaymentProcessingModal").then((m) => m.PaymentProcessingModal));
const PaymentConfirmingModal = dynamic(() => import("./PaymentConfirmingModal").then((m) => m.PaymentConfirmingModal));
const PaymentVerificationFailedModal = dynamic(() =>
  import("./PaymentVerificationFailedModal").then((m) => m.PaymentVerificationFailedModal)
);
const PremiumUpgradeModal = dynamic(() => import("./PremiumUpgradeModal").then((m) => m.PremiumUpgradeModal));
const WelcomeToPremiumModal = dynamic(() => import("./WelcomeToPremiumModal").then((m) => m.WelcomeToPremiumModal));
const VideoWalkthroughModal = dynamic(() => import("./VideoWalkthroughModal").then((m) => m.VideoWalkthroughModal));
const WalkthroughConfirmModal = dynamic(() =>
  import("./WalkthroughConfirmModal").then((m) => m.WalkthroughConfirmModal)
);
const WelcomeModal = dynamic(() => import("./WelcomeModal").then((m) => m.WelcomeModal));

export const appModals = {
  "exercise-success-modal": ExerciseSuccessModal,
  "exercise-completion-modal": ExerciseCompletionModal,
  "level-milestone-modal": LevelMilestoneModal,
  "subscription-modal": SubscriptionModal,
  "subscription-success-modal": SubscriptionSuccessModal,
  "subscription-checkout-modal": SubscriptionCheckoutModal,
  "badge-modal": BadgeModal,
  "change-password-modal": ChangePasswordModal,
  "change-email-modal": ChangeEmailModal,
  "cancel-subscription-confirm-modal": CancelSubscriptionConfirmModal,
  "cancel-subscription-success-modal": CancelSubscriptionSuccessModal,
  "delete-account-modal": DeleteAccountModal,
  "avatar-edit-modal": AvatarEditModal,
  "payment-processing-modal": PaymentProcessingModal,
  "payment-confirming-modal": PaymentConfirmingModal,
  "payment-verification-failed-modal": PaymentVerificationFailedModal,
  "premium-upgrade-modal": PremiumUpgradeModal,
  "welcome-to-premium-modal": WelcomeToPremiumModal,
  "video-walkthrough-modal": VideoWalkthroughModal,
  "walkthrough-confirm-modal": WalkthroughConfirmModal,
  "welcome-modal": WelcomeModal
};
