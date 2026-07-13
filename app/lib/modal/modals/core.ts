import dynamic from "next/dynamic";

// Always-available modals: triggered from anywhere (global error handler,
// auth flow, generic confirm/info dialogs). Registered by the root layout
// via GlobalModalProvider, so they ship to every route.

const ExampleModal = dynamic(() => import("./ExampleModal").then((m) => m.ExampleModal));
const ConfirmationModal = dynamic(() => import("./ConfirmationModal").then((m) => m.ConfirmationModal));
const ConnectionErrorModal = dynamic(() => import("./ConnectionErrorModal").then((m) => m.ConnectionErrorModal));
const AuthErrorModal = dynamic(() => import("./AuthErrorModal").then((m) => m.AuthErrorModal));
const InfoModal = dynamic(() => import("./InfoModal").then((m) => m.InfoModal));
const SessionExpiredModal = dynamic(() => import("./SessionExpiredModal").then((m) => m.SessionExpiredModal));
const RateLimitModal = dynamic(() => import("./RateLimitModal").then((m) => m.RateLimitModal));
const CalendarSubscribeModal = dynamic(() => import("./CalendarSubscribeModal").then((m) => m.CalendarSubscribeModal));

export const coreModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "connection-error-modal": ConnectionErrorModal,
  "auth-error-modal": AuthErrorModal,
  "info-modal": InfoModal,
  "session-expired-modal": SessionExpiredModal,
  "rate-limit-modal": RateLimitModal,
  "calendar-subscribe-modal": CalendarSubscribeModal
};
