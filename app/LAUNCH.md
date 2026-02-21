# Launch Checklist

## Subscriptions

### Remove remaining Max tier references

The Max tier was supposedly removed but several files still reference it.

- [ ] `components/settings/subscription/states/CancellingScheduledState.tsx` — `tier: "premium" | "max"` prop type, hardcoded `$9` Max price, Max feature list
- [ ] `components/settings/subscription/states/PaymentFailedGraceState.tsx` — `tier: "premium" | "max"` prop type, hardcoded `$9` Max price
- [ ] `components/settings/subscription/states/IncompletePaymentState.tsx` — `tier: "premium" | "max"` prop type, hardcoded `$9` Max price, Max feature list
- [ ] `components/settings/subscription/states/IncompleteExpiredState.tsx` — hardcoded `$9` Max card with "Most Popular" badge, Max feature list
- [ ] `lib/modal/store.ts` — `suggestedTier?: "premium" | "max"` in modal props type
- [ ] `lib/modal/modals/SubscriptionModal.tsx` — `suggestedTier?: "premium" | "max"` in component props type

## Premium

### Places to Align

#### Canonical feature lists

The source of truth is `lib/pricing.ts` but almost no component actually uses it consistently. There are at least 6 different versions of "what Premium includes" across the codebase.

**`lib/pricing.ts` — canonical definitions:**

- Standard: "Access to free courses", "Basic coding exercises", "Community support", "1 AI help per month"
- Premium: "All Free features", "Unlimited AI help", "Access to all exercises", "Certificates", "Ad-free experience"

**Components with their own hardcoded feature lists:**

- [ ] `lib/modal/modals/PremiumUpgradeModal/BasicPlanSection.tsx` — "40 Exercises", "Concept Library", "30 mins of AI support" (none of these match the canonical Free features)
- [ ] `lib/modal/modals/PremiumUpgradeModal/PremiumPlanSection.tsx` — "Unlimited AI support from Jiki", "Unlimited exercises and projects", "Earn certificates for courses", "Ad-free learning experience", "Early access to new features" (adds "Early access" not in canonical list)
- [ ] `components/settings/subscription/BenefitSection.tsx` — 6 benefits including "Priority support" and "Early access" (neither in canonical list)
- [ ] `components/settings/subscription/PremiumUpsell.tsx` — 4 benefits (subset of BenefitSection, missing "Priority support" and "Early access")
- [ ] `components/settings/modals/CancelSubscriptionConfirmModal.tsx` — "Unlimited AI help from Jiki", "All projects and learning paths", "Completion certificates", "Ad-free experience" (different wording again)
- [ ] `components/settings/subscription/states/PreviouslySubscribedState.tsx` — "Advanced exercises", "Progress tracking", "Community access" (completely different set)
- [ ] `components/settings/subscription/states/PaymentFailedExpiredState.tsx` — same as PreviouslySubscribedState: "Advanced exercises", "Progress tracking", "Community access"
- [ ] `components/settings/subscription/states/CancellingScheduledState.tsx` — Premium: "Advanced exercises", "Progress tracking", "Community access"
- [ ] `components/settings/subscription/states/PaymentFailedGraceState.tsx` — Premium: "Advanced exercises", "Progress tracking", "Community access"
- [ ] `components/settings/subscription/states/IncompletePaymentState.tsx` — Premium: "Advanced exercises", "Progress tracking", "Community access"
- [ ] `components/settings/subscription/states/IncompleteExpiredState.tsx` — Premium: "Advanced exercises", "Progress tracking", "Community access"

#### Hardcoded prices (should use `<PremiumPrice>` component)

- [ ] `components/coding-exercise/ui/chat-panel-states/FreeUserLimitReached.tsx` — hardcoded "Just £3.99/month!" (British pounds, not localized)
- [ ] `components/settings/subscription/states/CancellingScheduledState.tsx` — hardcoded `$3` for Premium
- [ ] `components/settings/subscription/states/PaymentFailedGraceState.tsx` — hardcoded `$3` for Premium
- [ ] `components/settings/subscription/states/IncompletePaymentState.tsx` — hardcoded `$3` for Premium
- [ ] `components/settings/subscription/states/IncompleteExpiredState.tsx` — hardcoded `$3` for Premium
- [ ] `lib/pricing.ts` — hardcoded `$3.99` fallback price (used by `PRICING_TIERS.premium.price`)

#### Free plan description inconsistencies

The Free plan is described differently in every location:

- [ ] `lib/pricing.ts` — "1 AI help per month"
- [ ] `lib/modal/modals/PremiumUpgradeModal/BasicPlanSection.tsx` — "30 mins of AI support"
- [ ] `components/settings/ui/SubscriptionStatus.tsx` — "Jiki AI to help you out for one exercise per month"
- [ ] `components/coding-exercise/ui/chat-panel-states/FreeUserCanStart.tsx` — "You can use Jiki AI once on the Free plan"
- [ ] `components/coding-exercise/ui/chat-panel-states/FreeUserCanStart.tsx` — confirmation dialog says "You can only Talk to Jiki on one exercise with the Free plan"

#### Value proposition copy

- [ ] `lib/pricing.ts` — Standard: "Perfect for getting started", Premium: "Unlock advanced features"
- [ ] `lib/modal/modals/PremiumUpgradeModal/BasicPlanSection.tsx` — "Accelerate your learning!" / "Upgrade to Premium and get personalised support when you need it most"
- [ ] `lib/modal/modals/PremiumUpgradeModal/PremiumPlanSection.tsx` — daily price pitch: "(That's only [price] a day)"
- [ ] `components/settings/subscription/PremiumUpsell.tsx` — "Unlock a better way to learn" / "You're currently on the Free plan. Upgrade to Premium to unlock:"
- [ ] `components/settings/subscription/BenefitSection.tsx` — Active: "You're enjoying Premium benefits" / "Here's what you're unlocking every day"; Cancelling: "Don't lose your Premium benefits" / "Keep learning without limits"
- [ ] `components/settings/subscription/states/NeverSubscribedState.tsx` — "Unlock advanced features and enhanced learning experiences with our premium plans."
- [ ] `components/settings/subscription/states/PreviouslySubscribedState.tsx` — "Welcome Back!" / "Resubscribe to continue your learning journey with premium features." / "Instant Access"
- [ ] `components/settings/subscription/states/PaymentFailedExpiredState.tsx` — "Resubscribe to Continue Learning" / "Choose a plan to restore your access and continue your learning journey."
- [ ] `components/settings/modals/CancelSubscriptionConfirmModal.tsx` — "We'd hate to see you go!" / "You're currently enjoying:"
- [ ] `lib/modal/modals/WelcomeToPremiumModal.tsx` — "Welcome to Premium!" / "Unlimited chats with Jiki on all lessons, and so much more awaits you."
- [ ] `lib/modal/modals/SubscriptionModal.tsx` — context-dependent: "Unlock AI Chat Assistant" / "Upgrade Your Plan" / "Choose Your Plan"
- [ ] `lib/modal/modals/SubscriptionSuccessModal.tsx` — "Welcome to AI Chat!" / "Feature Unlocked!" / "Welcome to [tier]!"
- [ ] `lib/modal/modals/PaymentProcessingModal.tsx` — "We're waiting for your payment provider to send us the funds. Once they do we'll upgrade your plan to Premium and send you an email."
- [ ] `components/coding-exercise/ui/ChatPremiumUpgrade.tsx` — "AI Chat Assistant" / "This feature is only available to Premium subscribers."
- [ ] `components/coding-exercise/ui/chat-panel-states/FreeUserCanStart.tsx` — "Feeling Stuck? Talk to Jiki!" / "Work with Jiki to understand whatever's confusing you."
- [ ] `components/coding-exercise/ui/chat-panel-states/FreeUserLimitReached.tsx` — "Feeling Stuck? Talk to Jiki!" / "You've used your free conversation."
- [ ] `components/coding-exercise/ui/chat-panel-states/LockedConversation.tsx` — "Your AI coding assistant is here to help you get unstuck" / "You're no longer on the Premium Plan."
- [ ] `components/coding-exercise/ui/chat-panel-states/PremiumUserCanStart.tsx` — "Feeling Stuck? Talk to Jiki"
- [ ] `components/dashboard/projects-sidebar/ui/PremiumBox.tsx` — "Never get stuck" / "Jiki's friendly AI will support you while you learn to code. Blah blah blah." (PLACEHOLDER TEXT)
- [ ] `components/layout/sidebar/Sidebar.tsx` — "Upgrade to Premium" button (always visible, even for premium users?)

#### Placeholder / incomplete content

- [ ] `components/dashboard/projects-sidebar/ui/PremiumBox.tsx` — "Blah blah blah." placeholder description
- [ ] `components/settings/subscription/BenefitSection.tsx` — placeholder `#` links for "what's included" and "contact support"
- [ ] `lib/modal/modals/SubscriptionCheckoutModal.tsx` — placeholder `#` links for Terms of Service and Privacy Policy (also noted in TODO.md)

#### Blog / Article CTAs

- [ ] `components/blog/BlogPostPage.tsx` — "Try Jiki for free" / "Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your skills — it's free!"
- [ ] `components/articles/ArticleDetailPage.tsx` — same copy as BlogPostPage

## Other Issues

### Security

- [ ] `components/settings/payment-history/PaymentHistory.tsx:9-13` — Open redirect vulnerability: receipt URLs from API opened without validation. Should validate against expected Stripe domains.

### TODOs in code

- [ ] `lib/modal/BaseModal.tsx:52-54` — TODO: Add support for non-dismissible modals
- [ ] `lib/modal/GlobalModalProvider.tsx:8-10` — TODO: Add support for non-dismissible modals (GlobalErrorHandler passes dismissible: false but it's not respected)
- [ ] `lib/modal/modals/hooks/useExerciseCompletionModal.ts:106` — TODO: Send both ratings to API when endpoint is ready
- [ ] `lib/api/projects.ts:65-67` — TODO: Backend doesn't have explicit start endpoint yet
- [ ] `lib/api/projects.ts:78-80` — TODO: Backend doesn't have explicit complete endpoint yet
- [ ] `components/coding-exercise/ui/scrubber/ScrubberInput.tsx:138,142` — TODO: Implement keyboard shortcuts (2 occurrences)
- [ ] `components/coding-exercise/lib/stubs.ts:9` — TODO: edit this
- [ ] `components/coding-exercise/ui/test-results-view/UnhandledErrorView.tsx:4` — TODO: use orchestrator's error store
- [ ] `components/coding-exercise/ui/instructions-panel/InstructionsPanel.tsx:46` — TODO: Get actual progress from API/orchestrator when available
- [ ] `components/coding-exercise/ui/codemirror/utils/getFoldedLines.ts:10` — TODO: Check why it's always falsy
- [ ] `components/coding-exercise/ui/codemirror/utils/scrollToLine.ts:16` — TODO: Check why if it's really always truthy or not
- [ ] `components/coding-exercise/ui/codemirror/extensions/breakpoint.ts:84` — TODO: Review why this is always falsy
- [ ] `components/coding-exercise/ui/codemirror/extensions/end-line-information/describeError.ts:35` — TODO: Check if message can be null
- [ ] `components/coding-exercise/ui/codemirror/extensions/edit-editor/utils.ts:264` — TODO: Recalculate character positions after removing lines
- [ ] `app/styles/components/navigation.css:174,193` — TODO: Style premium button using colors from palette instead of custom purple

### Incomplete features

- [ ] Non-dismissible modals — `BaseModal.tsx` and `GlobalModalProvider.tsx` have TODOs, e2e tests are skipped
- [ ] Exercise ratings API — ratings collected in UI but not sent to backend (`useExerciseCompletionModal.ts:106`)

---

## Review Copy

All user-facing copy strings in the codebase, by file.

### `lib/pricing.ts`

- [ ] `L30` — "Free"
- [ ] `L32` — "Perfect for getting started"
- [ ] `L33` — "Access to free courses"
- [ ] `L33` — "Basic coding exercises"
- [ ] `L33` — "Community support"
- [ ] `L33` — "1 AI help per month"
- [ ] `L37` — "Premium"
- [ ] `L39` — "Unlock advanced features"
- [ ] `L41` — "All Free features"
- [ ] `L42` — "Unlimited AI help"
- [ ] `L43` — "Access to all exercises"
- [ ] `L44` — "Certificates"
- [ ] `L45` — "Ad-free experience"

### `lib/modal/modals/PremiumUpgradeModal/BasicPlanSection.tsx`

- [ ] `L3` — "40 Exercises"
- [ ] `L3` — "Concept Library"
- [ ] `L3` — "30 mins of AI support"
- [ ] `L9` — "Accelerate your learning!"
- [ ] `L11` — "Upgrade to Premium and get personalised support when you need it most"
- [ ] `L14` — "Basic Plan"
- [ ] `L15` — "Free forever"
- [ ] `L25` — "+ access to basic tutorials and community forums for additional learning resources."

### `lib/modal/modals/PremiumUpgradeModal/PremiumPlanSection.tsx`

- [ ] `L11` — "Unlimited AI support from Jiki"
- [ ] `L12` — "Unlimited exercises and projects"
- [ ] `L13` — "Earn certificates for courses"
- [ ] `L14` — "Ad-free learning experience"
- [ ] `L15` — "Early access to new features"
- [ ] `L22` — "Jiki Premium"
- [ ] `L27` — "/month"
- [ ] `L30` — "(That's only {daily price} a day)"
- [ ] `L47` — "Upgrade to Premium"
- [ ] `L47` — "Processing..."

### `lib/modal/modals/PremiumUpgradeModal/index.tsx`

- [ ] `L49` — "Not now, maybe later"

### `lib/modal/modals/SubscriptionModal.tsx`

- [ ] `L51` — "Unlock AI Chat Assistant"
- [ ] `L52` — "Get instant help with your coding exercises from our AI assistant."
- [ ] `L56` — "Unlock {feature || 'Premium Features'}"
- [ ] `L57` — "Upgrade your plan to access advanced features and enhanced learning experiences."
- [ ] `L61` — "Choose Your Plan"
- [ ] `L62` — "Select the subscription plan that best fits your learning needs."
- [ ] `L67` — "Upgrade Your Plan"
- [ ] `L68` — "Choose the plan that fits your learning goals and unlock advanced features."
- [ ] `L79` — "Please log in to upgrade your account"
- [ ] `L96` — "Failed to start checkout process. Please try again."
- [ ] `L121` — "What you'll unlock with {feature}:"
- [ ] `L148` — "Recommended"
- [ ] `L181` — "Choose Premium"
- [ ] `L189` — "Your subscription will renew automatically each month. You can cancel anytime from your settings."
- [ ] `L193` — "Not now, maybe later"

### `lib/modal/modals/SubscriptionSuccessModal.tsx`

- [ ] `L31` — "Welcome to AI Chat!"
- [ ] `L32` — "Your AI assistant is now unlocked and ready to help with your coding exercises."
- [ ] `L34` — "Ask questions about your code"
- [ ] `L35` — "Get explanations for complex concepts"
- [ ] `L36` — "Receive personalized hints and guidance"
- [ ] `L41` — "Feature Unlocked!"
- [ ] `L42` — "You now have access to premium features that will enhance your learning experience."
- [ ] `L47` — "Welcome to {tierInfo.name}!"
- [ ] `L48` — "Your subscription has been activated. Explore your new features in the settings."
- [ ] `L55` — "Welcome to {tierInfo.name}!"
- [ ] `L56` — "Thank you for upgrading your plan. You now have access to all premium features."
- [ ] `L96` — "{tierInfo.name} Plan"
- [ ] `L99` — "/month"
- [ ] `L105` — "What you can do now:"
- [ ] `L129` — "Get Started"
- [ ] `L141` — "Continue Learning"
- [ ] `L146` — "Skip for now" / "Close"
- [ ] `L153` — "Your subscription will renew automatically on {renewalDate}. Manage your subscription in Settings."

### `lib/modal/modals/WelcomeToPremiumModal.tsx`

- [ ] `L25` — "Premium Member"
- [ ] `L29` — "Welcome to Premium!"
- [ ] `L33` — "Great, you now have all the benefits included in the Premium Plan! Unlimited chats with Jiki on all lessons, and so much more awaits you."
- [ ] `L39` — "Continue"

### `lib/modal/modals/PaymentProcessingModal.tsx`

- [ ] `L23` — "Payment Processing"
- [ ] `L25` — "Thank you. We're waiting for your payment provider to send us the funds. Once they do we'll upgrade your plan to Premium and send you an email."
- [ ] `L29` — "Continue using Jiki"

### `lib/modal/modals/SubscriptionCheckoutModal/ModalBody.tsx`

- [ ] `L19` — "Error: {error message}"
- [ ] `L25` — "Close"
- [ ] `L36` — "Jiki {tierInfo.name}"
- [ ] `L37` — "Billed monthly. Cancel anytime."
- [ ] `L43` — "/mo"

### `lib/modal/modals/SubscriptionCheckoutModal/PaymentForm.tsx`

- [ ] `L30` — "Connecting to Stripe"
- [ ] `L71` — "Payment failed"
- [ ] `L87` — "Processing..."
- [ ] `L90` — "Pay {price}"
- [ ] `L97` — "Secured by stripe"

### `lib/modal/modals/ConfirmationModal.tsx`

- [ ] `L17` — "Confirm Action"
- [ ] `L18` — "Are you sure you want to proceed?"
- [ ] `L19` — "Confirm"
- [ ] `L20` — "Cancel"

### `lib/modal/modals/ExerciseSuccessModal.tsx`

- [ ] `L12` — "Congratulations!"
- [ ] `L13` — "All tests passed! You've successfully completed this exercise."
- [ ] `L14` — "Continue"

### `lib/modal/modals/LevelMilestoneModal.tsx`

- [ ] `L49` — "Level Complete!"
- [ ] `L52` — "Congratulations! You've successfully completed {levelTitle} and mastered all its concepts."
- [ ] `L63` — "Lessons Completed"
- [ ] `L71` — "XP Earned"
- [ ] `L77` — "You're now ready to unlock the next level and continue your learning journey!"
- [ ] `L84` — "Go to Dashboard"
- [ ] `L87` — "Continue to Next Level"

### `lib/modal/modals/BadgeModal.tsx`

- [ ] `L35` — "Fun Fact"
- [ ] `L40` — "Keep Going!"

### `lib/modal/modals/ConnectionErrorModal.tsx`

- [ ] `L8` — "JIKI"
- [ ] `L14` — "Whoops! Lost connection"
- [ ] `L16` — "Jiki got a little tangled up and dropped the connection. Don't worry though - we're working on getting things plugged back in!"
- [ ] `L24` — "Reconnecting"
- [ ] `L29` — "Just sit tight - this usually fixes itself in a few moments. If the problem persists, check our status page."

### `lib/modal/modals/AuthErrorModal.tsx`

- [ ] `L8` — "JIKI"
- [ ] `L18` — "You've been Logged out."
- [ ] `L19` — "For some reason you've been logged out (maybe a security check, maybe you logged out on a different device?). Please reload the page to continue."
- [ ] `L26` — "Reload Page"
- [ ] `L30` — "If this keeps happening, try clearing your cookies or contact support."

### `lib/modal/modals/SessionExpiredModal.tsx`

- [ ] `L14` — "Session Expired"
- [ ] `L15` — "Your session has expired. Please log in again."
- [ ] `L21` — "Reload Page"

### `lib/modal/modals/RateLimitModal.tsx`

- [ ] `L33` — "JIKI"
- [ ] `L39` — "You've moved too fast."
- [ ] `L41` — "You've sent too many requests to our servers and so we're putting you on pause for a few seconds. Please wait and you'll be automatically reconnected."
- [ ] `L64` — "Reconnecting in {timeLeft} seconds"
- [ ] `L66` — "This page will automatically refresh"
- [ ] `L71` — "Note: Opening new tabs or making additional requests will extend your wait time."

### `lib/modal/modals/steps/SuccessStep.tsx`

- [ ] `L18` — "All tests passed!"
- [ ] `L19` — "Great work! You're ready to complete this exercise and move on to the next challenge."
- [ ] `L25` — "Tidy code first"
- [ ] `L28` — "Complete Exercise"

### `lib/modal/modals/steps/ConfirmationStep.tsx`

- [ ] `L13` — "Are you sure?"
- [ ] `L14` — "Are you sure you want to mark this exercise as complete? You can always come back and improve your solution later."
- [ ] `L21` — "Cancel"
- [ ] `L24` — "Yes, Complete"

### `lib/modal/modals/steps/DifficultyRatingStep.tsx`

- [ ] `L16` — "Too easy" / "Easy" / "Just right" / "Hard" / "Too hard"
- [ ] `L18` — "Frustrating" / "Pretty good" / "Amazing!"
- [ ] `L26` — "Rate your experience"
- [ ] `L27` — "Help us improve {exerciseTitle} by rating it."
- [ ] `L30` — "Rate the difficulty"
- [ ] `L55` — "Rate the fun factor"
- [ ] `L79` — "Continue"

### `lib/modal/modals/steps/CompletedStep.tsx`

- [ ] `L30` — "Exercise completed!"
- [ ] `L31` — "Great work completing {exerciseTitle}! Ready to continue to the next exercise?"
- [ ] `L37` — "Continue"

### `lib/modal/modals/steps/ConceptUnlockedStep.tsx`

- [ ] `L17` — "Concept unlocked!"
- [ ] `L18` — "You've unlocked a new concept to explore."
- [ ] `L22` — "Continue"
- [ ] `L32` — "You've unlocked a new concept: {unlockedConcept.title}"

### `lib/modal/modals/steps/ProjectUnlockedStep.tsx`

- [ ] `L35` — "Project unlocked!"
- [ ] `L36` — "All that practice means you're ready to combine what you've learned in a new project."
- [ ] `L43` — "New"
- [ ] `L54` — "Continue"

### `components/settings/SettingsPage.tsx`

- [ ] `L34` — "Settings"
- [ ] `L36` — "Manage your account and preferences."
- [ ] `L43` — "Account"
- [ ] `L50` — "Subscription"
- [ ] `L57` — "Notifications"
- [ ] `L61` — "Learning"
- [ ] `L69` — "Danger Zone"

### `components/settings/sections/ProfileSection.tsx`

- [ ] `L19` — "Name cannot be empty"
- [ ] `L22` — "Name must be less than 100 characters"
- [ ] `L29` — "Handle cannot be empty"
- [ ] `L32` — "Handle can only contain letters, numbers, underscores, and hyphens"
- [ ] `L35` — "Handle must be at least 3 characters"
- [ ] `L38` — "Handle must be less than 30 characters"
- [ ] `L45` — "Email cannot be empty"
- [ ] `L48` — "Please enter a valid email address"
- [ ] `L57` — "Name"
- [ ] `L60` — "Enter your name"
- [ ] `L62` — "Update Name"
- [ ] `L68` — "Handle"
- [ ] `L71` — "Enter your handle"
- [ ] `L73` — "Update Handle"
- [ ] `L79` — "Email"
- [ ] `L83` — "Enter your email"
- [ ] `L85` — "Update Email"
- [ ] `L90` — "Confirmation pending for: {unconfirmed_email}"
- [ ] `L92` — "Please check your email to confirm the change."
- [ ] `L97` — "Your email address is not confirmed."

### `components/settings/sections/PreferencesSection.tsx`

- [ ] `L19` — "Preferences"
- [ ] `L22` — "Language"
- [ ] `L25` — "Note: Only English is currently fully supported. Other languages coming soon."
- [ ] `L28-33` — "English" / "Spanish" / "French" / "German" / "Japanese" / "Chinese"

### `components/settings/tabs/NotificationsTab.tsx`

- [ ] `L21` — "Essential Service/Account messages"
- [ ] `L22` — "Important updates about your account, security, and service changes."
- [ ] `L27` — "Emails about new features or content"
- [ ] `L28` — "Stay updated with the latest features and content added to Jiki."
- [ ] `L33` — "Emails about livestreams"
- [ ] `L34` — "Get notified about upcoming livestreams and events."
- [ ] `L39` — "Emails when you reach new milestones"
- [ ] `L40` — "Celebrate your achievements and progress on Jiki."
- [ ] `L45` — "Other emails in response to things that you do on Jiki"
- [ ] `L46` — "Activity-based notifications like unlocking badges and completing challenges."

### `components/settings/tabs/LearningTab.tsx`

- [ ] `L41` — "Study Streaks"
- [ ] `L41` — "Enable streaks on my account."
- [ ] `L54` — "Learn more"

### `components/settings/tabs/DangerTab.tsx`

- [ ] `L19` — "Session Management"
- [ ] `L19` — "Manage your active sessions across all devices."
- [ ] `L25` — "Log out"
- [ ] `L31` — "Delete Account"
- [ ] `L32` — "Permanently delete your account and all associated data. This action cannot be undone."
- [ ] `L38` — "Delete Account"

### `components/settings/ui/SubscriptionStatus.tsx`

- [ ] `L22` — "Active"
- [ ] `L27` — "Canceled"
- [ ] `L32` — "Payment Failed"
- [ ] `L37` — "Cancelling"
- [ ] `L42` — "Incomplete"
- [ ] `L47` — "Session Expired"
- [ ] `L52` — "Not Subscribed"
- [ ] `L66` — "Current Plan"
- [ ] `L69` — "You are on the Jiki {tierDetails.name} plan at {price}/month"
- [ ] `L76` — "Your next billing date is {nextBillingDate}"
- [ ] `L91` — "Current Plan"
- [ ] `L93` — "Your Jiki Premium subscription has been cancelled."
- [ ] `L101` — "remaining to enjoy all Premium features."
- [ ] `L107` — "Your Premium plan will end on {nextBillingDate}."
- [ ] `L119` — "Current Plan"
- [ ] `L121` — "You are on the Free plan. This gives you all the content plus Jiki AI to help you out for one exercise per month."
- [ ] `L162` — "Service continues until period end"
- [ ] `L164` — "Payment failed - please update payment method"
- [ ] `L166` — "Cancellation scheduled - access until period end"
- [ ] `L168` — "Payment setup incomplete - please complete setup"
- [ ] `L171` — "Previous checkout session expired - please start a new subscription"

### `components/settings/ui/PasswordField.tsx`

- [ ] `L31` — "Current password is required"
- [ ] `L35` — "New password is required"
- [ ] `L39` — "New password must be at least 8 characters"
- [ ] `L43` — "Passwords do not match"
- [ ] `L84` — "Current password"
- [ ] `L90` — "Enter current password"
- [ ] `L96` — "New password"
- [ ] `L102` — "Enter new password"
- [ ] `L107` — "Confirm new password"
- [ ] `L113` — "Confirm new password"
- [ ] `L121` — "Cancel"
- [ ] `L124` — "Update Password"
- [ ] `L138` — "Password"
- [ ] `L151` — "Saved"
- [ ] `L158` — "Change"

### `components/settings/subscription/SubscriptionSection.tsx`

- [ ] `L35` — "Subscription"
- [ ] `L36` — "Manage your subscription plan and billing details"
- [ ] `L41` — "Loading subscription data..."

### `components/settings/subscription/BenefitSection.tsx`

- [ ] `L19` — "Unlimited AI help"
- [ ] `L20` — "Get personalised guidance from Jiki whenever you're stuck"
- [ ] `L23` — "Unlimited content"
- [ ] `L24` — "Access all exercises, projects, and learning paths"
- [ ] `L27` — "Certificates"
- [ ] `L28` — "Earn shareable certificates when you complete courses"
- [ ] `L31` — "Ad-free"
- [ ] `L32` — "Enjoy a distraction-free learning experience"
- [ ] `L35` — "Priority support"
- [ ] `L36` — "Get faster responses when you need help"
- [ ] `L39` — "Early access"
- [ ] `L40` — "Be the first to try new features and content"
- [ ] `L64` — "You're enjoying Premium benefits"
- [ ] `L74` — "Here's what you're unlocking every day"
- [ ] `L80` — "Got a question? Learn more about what's included or contact support."
- [ ] `L97` — "Don't lose your Premium benefits"
- [ ] `L100` — "Here's what you'll miss when your access ends"
- [ ] `L106` — "Keep learning without limits"
- [ ] `L108` — "Resubscribe now for just {price}/month and continue your coding journey with Jiki's support."
- [ ] `L120` — "Resubscribe to Premium"

### `components/settings/subscription/PremiumUpsell.tsx`

- [ ] `L19` — "Unlimited AI help"
- [ ] `L20` — "Get personalised guidance from Jiki whenever you're stuck"
- [ ] `L23` — "Unlimited content"
- [ ] `L24` — "Access all exercises, projects, and learning paths"
- [ ] `L27` — "Certificates"
- [ ] `L28` — "Earn shareable certificates when you complete courses"
- [ ] `L31` — "Ad-free"
- [ ] `L32` — "Enjoy a distraction-free learning experience"
- [ ] `L56` — "Unlock a better way to learn"
- [ ] `L59` — "You're currently on the Free plan. Upgrade to Premium to unlock:"
- [ ] `L75` — "Jiki Premium"
- [ ] `L81` — "/month"
- [ ] `L84` — "That's only {daily price} a day"
- [ ] `L93` — "Upgrade to Premium"

### `components/settings/subscription/CancelSection.tsx`

- [ ] `L11` — "Cancel Subscription"
- [ ] `L14` — "If you cancel, you'll lose access to Premium features at the end of your billing period. You can always resubscribe later."
- [ ] `L18` — "Cancel"

### `components/settings/subscription/SubscriptionErrorBoundary.tsx`

- [ ] `L42` — "Subscription System Error"
- [ ] `L46` — "We're experiencing issues loading your subscription information. This might be a temporary problem with our payment system."
- [ ] `L50` — "Please try refreshing the page, or contact support if the issue persists."
- [ ] `L57` — "Refresh Page"
- [ ] `L63` — "Try Again"

### `components/settings/subscription/states/NeverSubscribedState.tsx`

- [ ] `L18` — "Upgrade Your Plan"
- [ ] `L21` — "Unlock advanced features and enhanced learning experiences with our premium plans."
- [ ] `L31` — "/month"
- [ ] `L46` — "Upgrade to Premium"

### `components/settings/subscription/states/ActivePremiumState.tsx`

- [ ] `L24` — "Current Plan Benefits"
- [ ] `L25` — "Premium Active"
- [ ] `L39` — "Billing Information"
- [ ] `L41` — "/month"
- [ ] `L44` — "Next billing: {nextBillingDate}"
- [ ] `L50` — "Manage Subscription"
- [ ] `L53` — "Update Payment Details"
- [ ] `L56` — "Cancel Subscription"

### `components/settings/subscription/states/PreviouslySubscribedState.tsx`

- [ ] `L30` — "Welcome Back!"
- [ ] `L34` — "You previously had a {tier} subscription."
- [ ] `L35` — "Last active: {date}"
- [ ] `L36` — "Resubscribe to continue your learning journey with premium features."
- [ ] `L40` — "What You're Missing"
- [ ] `L43` — "Advanced exercises"
- [ ] `L44` — "Progress tracking"
- [ ] `L45` — "Community access"
- [ ] `L52` — "Choose Your Plan"
- [ ] `L53` — "Resubscribe to your previous plan or try a different tier."
- [ ] `L58` — "Premium"
- [ ] `L59` — "Previous Plan"
- [ ] `L62` — "/month"
- [ ] `L65` — "Advanced exercises"
- [ ] `L66` — "Progress tracking"
- [ ] `L67` — "Community access"
- [ ] `L76` — "Restore Premium"
- [ ] `L83` — "Instant Access"
- [ ] `L85` — "Your subscription will be activated immediately after payment, and you'll regain access to all premium features right away."

### `components/settings/subscription/states/PaymentFailedExpiredState.tsx`

- [ ] `L28` — "Subscription Suspended"
- [ ] `L32` — "Your {tier} subscription has been suspended due to payment failure."
- [ ] `L36` — "You now have access to Free plan features only. Resubscribe to restore your previous benefits."
- [ ] `L41` — "Current Access (Free Plan)"
- [ ] `L43` — "Basic exercises only"
- [ ] `L44` — "Limited progress tracking"
- [ ] `L45` — "No community features"
- [ ] `L51` — "Resubscribe to Continue Learning"
- [ ] `L52` — "Choose a plan to restore your access and continue your learning journey."
- [ ] `L58` — "Premium"
- [ ] `L60` — "/month"
- [ ] `L63` — "Advanced exercises"
- [ ] `L64` — "Progress tracking"
- [ ] `L65` — "Community access"
- [ ] `L74` — "Restore Premium"
- [ ] `L81` — "Need Help?"
- [ ] `L82` — "If you're experiencing payment issues, please contact our support team. We're here to help resolve any billing problems."

### `components/settings/subscription/states/CancellingScheduledState.tsx`

- [ ] `L23` — "$3"
- [ ] `L28` — "$9"
- [ ] `L38` — "Subscription Scheduled for Cancellation"
- [ ] `L42` — "Your {tier} subscription will be cancelled on {date}."
- [ ] `L46` — "You'll continue to have access to all {tier} features until then."
- [ ] `L51` — "Current Benefits Until {date}"
- [ ] `L55` — "Advanced exercises"
- [ ] `L56` — "Progress tracking"
- [ ] `L57` — "Community access"
- [ ] `L61` — "All Premium features"
- [ ] `L62` — "AI-powered hints"
- [ ] `L63` — "Priority support"
- [ ] `L64` — "Exclusive content"
- [ ] `L71` — "Reactivate Subscription"
- [ ] `L75` — "Update Payment Details"
- [ ] `L81` — "What happens after cancellation?"
- [ ] `L83` — "You'll be moved to the Free plan"
- [ ] `L84` — "Access to basic exercises only"
- [ ] `L85` — "No billing charges after {date}"
- [ ] `L86` — "You can resubscribe anytime"

### `components/settings/subscription/states/PaymentFailedGraceState.tsx`

- [ ] `L23` — "$3"
- [ ] `L28` — "$9"
- [ ] `L38` — "Payment Failed - Grace Period"
- [ ] `L42` — "Your payment for {tier} ({price}/month) could not be processed."
- [ ] `L45` — "Last attempt: {date}"
- [ ] `L47` — "Your subscription will be suspended on {date} unless payment is resolved."
- [ ] `L52` — "You still have access until {date}"
- [ ] `L55` — "Advanced exercises"
- [ ] `L56` — "Progress tracking"
- [ ] `L57` — "Community access"
- [ ] `L61` — "All Premium features"
- [ ] `L62` — "AI-powered hints"
- [ ] `L63` — "Priority support"
- [ ] `L64` — "Exclusive content"
- [ ] `L72` — "Update Payment Method"
- [ ] `L76` — "Try Payment Again"
- [ ] `L82` — "Common Payment Issues"
- [ ] `L83` — "Expired credit card"
- [ ] `L84` — "Insufficient funds"
- [ ] `L85` — "Card blocked by bank"
- [ ] `L86` — "Billing address mismatch"
- [ ] `L89` — "Contact your bank if the issue persists after updating payment details."

### `components/settings/subscription/states/IncompletePaymentState.tsx`

- [ ] `L15` — "$3"
- [ ] `L22` — "$9"
- [ ] `L34` — "Payment Setup Incomplete"
- [ ] `L38` — "Your {tier} subscription is pending payment completion."
- [ ] `L41` — "Complete your payment setup to activate your subscription and access all features."
- [ ] `L47` — "{tier} Plan - {price}/month"
- [ ] `L63` — "Complete Payment Setup"
- [ ] `L68` — "What's Next?"
- [ ] `L70` — "1. Complete your payment information"
- [ ] `L71` — "2. Your subscription will be activated immediately"
- [ ] `L72` — "3. Start accessing {tier} features"
- [ ] `L77` — "Current Access (Free Plan)"
- [ ] `L78` — "Until payment is completed, you have access to:"
- [ ] `L80` — "Basic exercises only"
- [ ] `L81` — "Limited progress tracking"
- [ ] `L82` — "No premium features"

### `components/settings/subscription/states/IncompleteExpiredState.tsx`

- [ ] `L14` — "Payment Setup Expired"
- [ ] `L18` — "Your previous payment setup attempt has expired."
- [ ] `L19` — "Start fresh with a new subscription to access premium features."
- [ ] `L24` — "Try Again"
- [ ] `L25` — "Choose your preferred plan to start the subscription process with a fresh payment setup."
- [ ] `L31` — "Premium"
- [ ] `L33` — "$3/month"
- [ ] `L35` — "Advanced exercises"
- [ ] `L36` — "Progress tracking"
- [ ] `L37` — "Community access"
- [ ] `L40` — "Try Again with Premium"
- [ ] `L47` — "Most Popular"
- [ ] `L49` — "Max"
- [ ] `L51` — "$9/month"
- [ ] `L54` — "Everything in Premium"
- [ ] `L55` — "AI-powered hints"
- [ ] `L56` — "Priority support"
- [ ] `L57` — "Exclusive content"
- [ ] `L64` — "Need Help?"
- [ ] `L65` — "If you're experiencing issues with payment setup, our support team can help:"
- [ ] `L68` — "Check your payment method details"
- [ ] `L69` — "Verify billing address information"
- [ ] `L70` — "Contact your bank if needed"
- [ ] `L71` — "Reach out to our support team"

### `components/settings/modals/CancelSubscriptionConfirmModal.tsx`

- [ ] `L31` — "Cancel your subscription?"
- [ ] `L33` — "We'd hate to see you go! If you cancel, you'll lose access to Premium at the end of your current billing period."
- [ ] `L41` — "Keep my subscription"
- [ ] `L44` — "Cancel subscription"
- [ ] `L52` — "Unlimited AI help from Jiki"
- [ ] `L53` — "All projects and learning paths"
- [ ] `L54` — "Completion certificates"
- [ ] `L55` — "Ad-free experience"
- [ ] `L61` — "You're currently enjoying:"

### `components/settings/modals/CancelSubscriptionSuccessModal.tsx`

- [ ] `L21` — "Subscription cancelled"
- [ ] `L23` — "Your Premium subscription has been cancelled. You can continue enjoying all Premium features until your current billing period ends."
- [ ] `L28` — "Premium access until"
- [ ] `L32` — "Changed your mind? You can resubscribe anytime."
- [ ] `L36` — "Got it"

### `components/settings/modals/ChangeEmailModal.tsx`

- [ ] `L62` — "Change Email Address"
- [ ] `L65` — "Important:"
- [ ] `L67` — "A confirmation email will be sent to your new email address. You'll need to confirm it before the change takes effect."
- [ ] `L74` — "Current Email"
- [ ] `L79` — "New Email Address"
- [ ] `L87` — "Enter your new email address"
- [ ] `L94` — "Confirm with Current Password"
- [ ] `L102` — "Enter your current password"
- [ ] `L105` — "Required for security verification"
- [ ] `L112` — "Update Email"
- [ ] `L120` — "Cancel"

### `components/settings/modals/ChangePasswordModal.tsx`

- [ ] `L62` — "Change Password"
- [ ] `L66` — "Current Password"
- [ ] `L74` — "Enter your current password"
- [ ] `L81` — "New Password"
- [ ] `L89` — "Enter your new password"
- [ ] `L92` — "Must be at least 8 characters long"
- [ ] `L96` — "Confirm New Password"
- [ ] `L104` — "Confirm your new password"
- [ ] `L113` — "Update Password"
- [ ] `L121` — "Cancel"

### `components/settings/modals/DeleteAccountModal.tsx`

- [ ] `L45` — "Are you sure?"
- [ ] `L47` — "Do you really want to delete your account? You will lose all your work. This is irreversible."
- [ ] `L52` — "Cancel"
- [ ] `L55` — "Delete Account"
- [ ] `L65` — "Security Check"
- [ ] `L67` — "We've sent you an email to confirm this is really you. Please click the button in that email to delete your account."
- [ ] `L72` — "I understand"

### `components/settings/payment-history/PaymentHistory.tsx`

- [ ] `L16` — "Payment History"
- [ ] `L17` — "View and download receipts for your past payments."
- [ ] `L22` — "Loading payment history..."
- [ ] `L26` — "Unable to load payment history. Please try again later."
- [ ] `L30` — "No payment history available."

### `components/settings/payment-history/PaymentHistoryTable.tsx`

- [ ] `L14` — "No payment history available."
- [ ] `L23` — "Date"
- [ ] `L24` — "Amount"
- [ ] `L25` — "Type"
- [ ] `L26` — "Method"

### `components/settings/payment-history/PaymentHistoryRow.tsx`

- [ ] `L31` — "Download Receipt"

### `components/coding-exercise/ui/ChatPanel.tsx`

- [ ] `L31` — "Chat unavailable"
- [ ] `L40` — "Talk to Jiki"
- [ ] `L41` — "Ask questions and get help from your AI coding assistant"
- [ ] `L183` — "Clear"
- [ ] `L192` — "Failed to load conversation history: {error}"
- [ ] `L198` — "Retry"

### `components/coding-exercise/ui/ChatPremiumUpgrade.tsx`

- [ ] `L18` — "Get instant help with coding exercises"
- [ ] `L19` — "Ask questions and receive explanations"
- [ ] `L20` — "Personalized hints and guidance"
- [ ] `L21` — "Debug your code with AI assistance"
- [ ] `L36` — "Chat"
- [ ] `L58` — "AI Chat Assistant"
- [ ] `L60` — "This feature is only available to Premium subscribers. Get instant help with your coding exercises from our AI assistant."
- [ ] `L110` — "Upgrade to Premium"

### `components/coding-exercise/ui/ChatMessages.tsx`

- [ ] `L33` — "Start a conversation! Ask questions about your code, the exercise, or request help with specific tasks."

### `components/coding-exercise/ui/ChatInput.tsx`

- [ ] `L15` — "Type your question here..."

### `components/coding-exercise/ui/ChatStatus.tsx`

- [ ] `L20` — "Error:"
- [ ] `L26` — "Retry"
- [ ] `L49` — "Assistant is thinking..."
- [ ] `L64` — "Assistant is typing..."

### `components/coding-exercise/ui/chat-panel-states/FreeUserCanStart.tsx`

- [ ] `L17` — "Get Jiki's help"
- [ ] `L19` — "You can only Talk to Jiki on one exercise with the Free plan. Are you sure you want to use it on this exercise?"
- [ ] `L20` — "No, not yet"
- [ ] `L21` — "Yes, let's go"
- [ ] `L42` — "Feeling Stuck? Talk to Jiki!"
- [ ] `L44` — "Work with Jiki to understand whatever's confusing you. You can use Jiki AI once on the Free plan."
- [ ] `L46` — "Upgrade to Jiki Premium"
- [ ] `L48` — "for unlimited usage."
- [ ] `L55` — "Start Talking to Jiki"
- [ ] `L61` — "Included in your Free plan"

### `components/coding-exercise/ui/chat-panel-states/FreeUserLimitReached.tsx`

- [ ] `L26` — "Feeling Stuck? Talk to Jiki!"
- [ ] `L28` — "You've used your free conversation. Continue learning with Jiki's help with concepts, debugging, and moving forward on exercises."
- [ ] `L35` — "Upgrade to Jiki Premium"
- [ ] `L39` — "Just £3.99/month!"

### `components/coding-exercise/ui/chat-panel-states/LockedConversation.tsx`

- [ ] `L43` — "Talk to Jiki"
- [ ] `L44` — "Your AI coding assistant is here to help you get unstuck"
- [ ] `L67` — "You're no longer on the Premium Plan."
- [ ] `L69` — "Upgrade"
- [ ] `L71` — "to continue the conversation."
- [ ] `L75` — "You've hit our fair use limits. Please try again tomorrow."
- [ ] `L78` — "Learn more about fair use limits"

### `components/coding-exercise/ui/chat-panel-states/PremiumUserCanStart.tsx`

- [ ] `L15` — "why your code isn't working"
- [ ] `L16` — "how to fix a bug"
- [ ] `L17` — "what this error means"
- [ ] `L18` — "how to approach this exercise"
- [ ] `L19` — "why this test is failing"
- [ ] `L60` — "Feeling Stuck? Talk to Jiki"
- [ ] `L62` — "Ask about..."
- [ ] `L86` — "Type your question here..."
- [ ] `L94` — "Ask Jiki"
- [ ] `L101` — "Included in your Premium plan"

### `components/coding-exercise/ui/RunButton.tsx`

- [ ] `L20` — "Running..." / "Run Code"

### `components/coding-exercise/ui/FunctionsView.tsx`

- [ ] `L12` — "No functions available for this exercise."
- [ ] `L30` — "Examples"

### `components/coding-exercise/ui/HintsPanel.tsx`

- [ ] `L24` — "No hints available for this exercise."
- [ ] `L37` — "If you're stuck on this exercise, these hints can help guide you in the right direction. Click on a hint to reveal helpful tips."
- [ ] `L52` — "Hint {n}"
- [ ] `L118` — "Hide" / "Reveal"
- [ ] `L126` — "Are you sure you want to reveal this hint?"
- [ ] `L129` — "Not for now"
- [ ] `L132` — "Yes"

### `components/coding-exercise/ui/LogPanel.tsx`

- [ ] `L23` — "This is the output from your code execution. Here you can analyse the changes you've made. Use console.log() to log values."
- [ ] `L29` — "Scenario Log"
- [ ] `L42` — "This is the output from your code execution for {test name} scenario. Here you can analyse the changes you've made. Use console.log() to log values."

### `components/coding-exercise/ui/TasksView.tsx`

- [ ] `L18` — "No tasks available for this exercise."
- [ ] `L62` — "Bonus"

### `components/coding-exercise/ui/LanguageToggle.tsx`

- [ ] `L11` — "JavaScript"
- [ ] `L12` — "Python"
- [ ] `L13` — "JikiScript"

### `components/coding-exercise/ui/FrameDescription.tsx`

- [ ] `L16` — "No frame selected"
- [ ] `L28` — "Line {n}"
- [ ] `L38` — "Timeline:"

### `components/dashboard/projects-sidebar/ui/PremiumBox.tsx`

- [ ] `L14` — "Never get stuck"
- [ ] `L18` — "Jiki's friendly AI will support you while you learn to code. Blah blah blah."
- [ ] `L23` — "Try Jiki AI for free"

### `components/dashboard/exercise-path/ui/ContinueLearningBanner.tsx`

- [ ] `L71` — "Continue Learning"
- [ ] `L72` — "Next: {lesson title}"
- [ ] `L74` — "Video" / "Quiz" / "Exercise"
- [ ] `L78` — "Start"

### `components/dashboard/exercise-path/ui/StartCard.tsx`

- [ ] `L12` — "The Start of your Journey"

### `components/dashboard/info-panel/LeaderboardCard.tsx`

- [ ] `L19` — "Weekly Leaderboard"
- [ ] `L28` — "View Full Leaderboard →"

### `components/layout/sidebar/Sidebar.tsx`

- [ ] `L23` — "Learn"
- [ ] `L24` — "Projects"
- [ ] `L25` — "Concepts"
- [ ] `L26` — "Achievements"
- [ ] `L27` — "Settings"
- [ ] `L53` — "Upgrade to Premium"

### `components/layout/AuthHeader.tsx`

- [ ] `L28` — "Jiki Learn"
- [ ] `L40` — "Blog"
- [ ] `L44` — "Articles"
- [ ] `L58` — "Welcome, {name}"
- [ ] `L63` — "Dashboard"
- [ ] `L69` — "Settings"
- [ ] `L79` — "Sign In"
- [ ] `L85` — "Sign Up"

### `components/auth/LoginForm.tsx`

- [ ] `L29` — "Email is required"
- [ ] `L31` — "Please enter a valid email"
- [ ] `L35` — "Password is required"
- [ ] `L37` — "Password must be at least 6 characters"
- [ ] `L80` — "Log In"
- [ ] `L82` — "Don't have an account?"
- [ ] `L84` — "Sign up for free."
- [ ] `L91` — "Log In with Google"
- [ ] `L94` — "OR"
- [ ] `L97` — "Email"
- [ ] `L103` — "Enter your email address"
- [ ] `L132` — "Password"
- [ ] `L138` — "Enter your password"
- [ ] `L162` — "Invalid email or password"
- [ ] `L167` — "Please confirm your email before logging in."
- [ ] `L172` — "Resend confirmation"
- [ ] `L185` — "Forgot your password?"
- [ ] `L197` — "Logging in..." / "Log In"
- [ ] `L203` — "Resend it."
- [ ] `L204` — "Didn't receive your confirmation email?"

### `components/auth/SignupForm.tsx`

- [ ] `L30` — "Email is required"
- [ ] `L33` — "Please enter a valid email"
- [ ] `L37` — "Password is required"
- [ ] `L39` — "Password must be at least 6 characters"
- [ ] `L95` — "Sign Up"
- [ ] `L97` — "Already got an account?"
- [ ] `L99` — "Log in"
- [ ] `L106` — "Sign Up with Google"
- [ ] `L110` — "OR"
- [ ] `L115` — "Email"
- [ ] `L121` — "Enter your email address"
- [ ] `L143` — "This email is already registered"
- [ ] `L153` — "Password"
- [ ] `L159` — "Enter your password"
- [ ] `L189` — "Signing up..." / "Sign Up"
- [ ] `L195` — "Resend it."
- [ ] `L196` — "Didn't receive your confirmation email?"

### `components/auth/ForgotPasswordForm.tsx`

- [ ] `L21` — "Email is required"
- [ ] `L23` — "Please enter a valid email address"
- [ ] `L40` — "If an account with that email exists, you'll receive reset instructions shortly."
- [ ] `L51` — "Forgot your password?"
- [ ] `L52` — "If you've forgotten your password, use the form below to request a link to change it."
- [ ] `L63` — "Email"
- [ ] `L69` — "Enter your email address"
- [ ] `L94` — "Sending..." / "Send Reset Link"
- [ ] `L99` — "Remembered your password?"
- [ ] `L101` — "Log in"

### `components/auth/ResetPasswordForm.tsx`

- [ ] `L24` — "Reset token is missing or invalid"
- [ ] `L28` — "Password is required"
- [ ] `L30` — "Password must be at least 6 characters"
- [ ] `L34` — "Password confirmation is required"
- [ ] `L36` — "Passwords don't match"
- [ ] `L74` — "Invalid Reset Link"
- [ ] `L79` — "This password reset link is invalid or has expired. Please request a new one."
- [ ] `L85` — "Request a new password reset"
- [ ] `L95` — "Reset your password"
- [ ] `L96` — "Enter your new password below."
- [ ] `L114` — "New Password"
- [ ] `L131` — "Enter your new password"
- [ ] `L139` — "Confirm New Password"
- [ ] `L156` — "Confirm your new password"
- [ ] `L170` — "Resetting..." / "Reset password"
- [ ] `L175` — "Remember your password?"
- [ ] `L176` — "Sign in"

### `components/auth/CheckInboxMessage.tsx`

- [ ] `L17` — "Check your inbox"
- [ ] `L19` — "We've sent a confirmation email to"
- [ ] `L22` — "Click the link in the email to activate your account. Didn't receive it?"
- [ ] `L24` — "Resend email"

### `components/auth/ConfirmingEmailMessage.tsx`

- [ ] `L9` — "Confirming your email..."
- [ ] `L11` — "Please wait while we confirm your email address."

### `components/auth/EmailConfirmedMessage.tsx`

- [ ] `L19` — "Email Confirmed!"
- [ ] `L22` — "Your email has been confirmed successfully. Redirecting to dashboard..."

### `components/auth/LinkExpiredMessage.tsx`

- [ ] `L13` — "Link expired"
- [ ] `L16` — "This confirmation link is no longer valid. Request a new one to continue."
- [ ] `L23` — "Resend confirmation email"
- [ ] `L27` — "Contact support"
- [ ] `L28` — "Need help?"

### `components/auth/ResendConfirmationForm.tsx`

- [ ] `L22` — "Email is required"
- [ ] `L25` — "Please enter a valid email address"
- [ ] `L43` — "If an account with that email exists, you'll receive confirmation instructions shortly."
- [ ] `L54` — "Resend confirmation instructions"
- [ ] `L55` — "Not received a confirmation email? Use the form below and we'll send you another."
- [ ] `L72` — "Email"
- [ ] `L78` — "Enter your email address"
- [ ] `L103` — "Sending..." / "Resend confirmation instructions"
- [ ] `L109` — "Log in"
- [ ] `L110` — "Already confirmed?"

### `components/auth/TwoFactorSetupForm.tsx`

- [ ] `L45` — "Invalid verification code"
- [ ] `L47` — "Verification failed. Please try again."
- [ ] `L66` — "Scan the QR code with your authenticator app to secure your account."
- [ ] `L74` — "Use Google Authenticator, 1Password, Authy, or a similar app to scan the code above."
- [ ] `L81` — "Enter the 6-digit code from your app"
- [ ] `L85` — "Verifying..."
- [ ] `L95` — "Cancel and sign in again"

### `components/auth/TwoFactorVerifyForm.tsx`

- [ ] `L38` — "Invalid verification code"
- [ ] `L40` — "Verification failed. Please try again."
- [ ] `L58` — "Two-Factor Authentication"
- [ ] `L59` — "Enter the 6-digit code from your authenticator app."
- [ ] `L66` — "Verification code"
- [ ] `L70` — "Verifying..."
- [ ] `L80` — "Cancel and sign in again"

### `components/auth/UnsubscribeContent.tsx`

- [ ] `L20` — "No unsubscribe token provided."
- [ ] `L42` — "This unsubscribe link is invalid or has expired."
- [ ] `L45` — "Too many requests. Please wait a moment and try again."
- [ ] `L51` — "Service temporarily unavailable. Please try again later."
- [ ] `L54` — "Unable to process your request. Please contact support if this continues."
- [ ] `L58` — "Network error. Please check your connection and try again."
- [ ] `L76` — "Unsubscribing..."
- [ ] `L78` — "Please wait while we process your request."
- [ ] `L93` — "Successfully Unsubscribed"
- [ ] `L95` — "You have been unsubscribed from our mailing list."
- [ ] `L110` — "Unsubscribe Failed"

### `components/choose-language/ui/LanguageSelectorStep.tsx`

- [ ] `L21` — "Choose which language you want to learn?"
- [ ] `L29` — "JavaScript"
- [ ] `L43` — "Python"
- [ ] `L56` — "Choose for me"
- [ ] `L65` — "You can't change once selected."

### `components/choose-language/ui/VideoStep.tsx`

- [ ] `L91` — "No video available"
- [ ] `L99` — "Watch the video then choose your language. Already know?"
- [ ] `L102` — "Skip the video"

### `components/concepts/ConceptsHeader.tsx`

- [ ] `L17` — "Concept Library"
- [ ] `L22` — "Sign up to track your progress and unlock personalized content!"

### `components/concepts/ConceptsSearch.tsx`

- [ ] `L34` — "Search concepts..."

### `components/concepts/ConceptCard.tsx`

- [ ] `L29` — "Locked"
- [ ] `L41` — "{n} sub-concepts"

### `components/concepts/ErrorStates.tsx`

- [ ] `L24` — "Try Again"
- [ ] `L56` — "0 results for \"{query}\""
- [ ] `L58` — "Try a different search term or browse the library."

### `components/concepts/LoadingStates.tsx`

- [ ] `L47` — "Loading..."

### `components/common/LessonLoadingModal/LessonLoadingModal.tsx`

- [ ] `L27` — "Personalising your lesson"
- [ ] `L34` — "Crafting something based on your preferences and progress"

### `components/common/NavigationLoadingOverlay.tsx`

- [ ] `L10` — "Loading exercise..."

### `components/lesson/LessonQuitButton.tsx`

- [ ] `L19` — "Quit Lesson"
- [ ] `L20` — "Are you sure you want to quit this lesson? Your progress won't be saved."
- [ ] `L21` — "Quit"
- [ ] `L22` — "Continue Learning"

### `components/video-exercise/ui/NoVideoPlaceholder.tsx`

- [ ] `L21` — "No video source available"
- [ ] `L22` — "Host: {host}"

### `components/video-exercise/ui/FloatingPill.tsx`

- [ ] `L34` — "Lesson Complete" / "Lesson Progress"
- [ ] `L36` — "Finished" / "Watching"
- [ ] `L45` — "Finish watching to continue"
- [ ] `L53` — "Saving..." / "Continue"

### `components/delete-account/DeletedState.tsx`

- [ ] `L9` — "Your account has been deleted"
- [ ] `L11` — "We're sorry to see you go. We hope you've enjoyed Jiki. Good luck with your coding journey!"

### `components/delete-account/DeletingState.tsx`

- [ ] `L9` — "Deleting your account"
- [ ] `L11` — "Please wait"

### `components/delete-account/ErrorState.tsx`

- [ ] `L9` — "There's been an error"
- [ ] `L11` — "There has been an error deleting your account. We have been notified and will delete it manually for you."

### `components/delete-account/ExpiredLinkState.tsx`

- [ ] `L10` — "Link expired or invalid"
- [ ] `L12` — "This deletion link is no longer valid. It may have already been used or has expired."
- [ ] `L15` — "If you still want to delete your account, please log in and request a new deletion link from your settings."
- [ ] `L18` — "Go to homepage"

### `components/unsubscribe/UnsubscribePage.tsx`

- [ ] `L47` — "Email Preferences"
- [ ] `L48` — "Manage how and when we communicate with you."

### `components/unsubscribe/UnsubscribeFromAllSection.tsx`

- [ ] `L21` — "Unsubscribe from All Emails"
- [ ] `L23` — "Want to stop all email communications from Jiki? This will unsubscribe you from all marketing, notification, and reminder emails."
- [ ] `L29` — "You've been unsubscribed from all Jiki emails."
- [ ] `L34` — "Failed to update your preferences. Please try again."
- [ ] `L43` — "Processing..." / "Unsubscribe from All Emails"

### `components/unsubscribe/UnsubscribeFromEmailSection.tsx`

- [ ] `L29` — "Already Unsubscribed"
- [ ] `L31` — "You are not currently subscribed to {type} emails."
- [ ] `L39` — "Unsubscribe from This Email"
- [ ] `L41` — "No longer want to receive this type of email? Click below to unsubscribe from {type} emails."
- [ ] `L47` — "You've been unsubscribed from {type}."
- [ ] `L52` — "Failed to update your preferences. Please try again."
- [ ] `L61` — "Processing..." / "Unsubscribe from {type}"

### `components/unsubscribe/ManageNotificationsSection.tsx`

- [ ] `L12` — "Product Updates"
- [ ] `L13` — "Stay informed about new features and improvements."
- [ ] `L17` — "Event Notifications"
- [ ] `L18` — "Get notified about upcoming livestreams and events."
- [ ] `L22` — "Achievement Notifications"
- [ ] `L23` — "Receive notifications when you unlock new skills or achievements."
- [ ] `L27` — "Activity Emails"
- [ ] `L28` — "Activity-based notifications like unlocking badges and completing challenges."
- [ ] `L60` — "Manage Your Notifications"
- [ ] `L61` — "Fine-tune which emails you receive by toggling individual notification types on or off."
- [ ] `L79` — "Your email preferences have been updated."
- [ ] `L87` — "Change Preferences"

### `components/blog/BlogPostPage.tsx`

- [ ] `L57` — "Try Jiki for free"
- [ ] `L58` — "10,000+ learners use Jiki to master programming through hands-on practice and expert mentorship every month."
- [ ] `L59` — "Get started now"
- [ ] `L69` — "Ready to Start Your Coding Journey?"
- [ ] `L70` — "Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your skills — it's free!"
- [ ] `L71` — "Sign Up to Jiki"

### `components/articles/ArticleDetailPage.tsx`

- [ ] `L56` — "Try Jiki for free"
- [ ] `L57` — "10,000+ learners use Jiki to master programming through hands-on practice and expert mentorship every month."
- [ ] `L58` — "Get started now"
- [ ] `L64` — "Ready to Start Your Coding Journey?"
- [ ] `L66` — "Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your skills — it's free!"
- [ ] `L67` — "Sign Up to Jiki"

### `components/ui/AuthLayout.tsx`

- [ ] `L17` — "Jiki"
- [ ] `L18` — "Your coding journey starts here"
- [ ] `L20` — "Join millions of learners transforming their careers through hands-on coding practice."
- [ ] `L24` — "Created By"
- [ ] `L25` — "The team behind Exercism"

### `components/ui/BadgeNewLabel.tsx`

- [ ] `L8` — "NEW"

### `components/ui/LoadingJiki.tsx`

- [ ] `L24` — "Waking up Jiki"
- [ ] `L27` — "Preparing your learning experience"

### `components/ui/OTPInput.tsx`

- [ ] `L70` — "Digit {n} of 6"

### `components/ui/Pagination.tsx`

- [ ] `L50` — "Previous page"
- [ ] `L75` — "Next page"

### `app/layout.tsx`

- [ ] `L32` — "Jiki"
- [ ] `L33` — "Welcome to Jiki - the best place to learn to code. Fun, effective and free!"

### `app/not-found.tsx`

- [ ] `L7` — "Page not found"
- [ ] `L8` — "Looks like we can't find that page. Sorry!"
- [ ] `L9` — "Take me home"

### `app/error.tsx`

- [ ] `L22` — "Something went wrong"
- [ ] `L23` — "We encountered an unexpected error. Sorry about that!"
- [ ] `L24` — "Try again"

### `app/components/ErrorPage.tsx`

- [ ] `L24` — "JIKI"
