"use client";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useErrorHandlerStore } from "@/lib/api/errorHandlerStore";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";

export function GlobalErrorHandler() {
  const { criticalError } = useErrorHandlerStore();
  const [countdown, setCountdown] = useState<number>(0);

  // Handle countdown timer for rate limit errors
  useEffect(() => {
    if (criticalError instanceof RateLimitError) {
      setCountdown(criticalError.retryAfterSeconds);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [criticalError]);

  // No error - render nothing
  if (!criticalError) {
    return null;
  }

  // Render modal with error-specific content
  return (
    <Modal
      isOpen={true}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 z-notification"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-error-modal-backdrop"
      ariaHideApp={false}
    >
      {criticalError instanceof NetworkError && <NetworkErrorContent />}
      {criticalError instanceof AuthenticationError && <AuthErrorContent />}
      {criticalError instanceof RateLimitError && <RateLimitContent countdown={countdown} />}
    </Modal>
  );
}

/**
 * Network Error Content
 * Shows when connection is lost - auto-recovers when connection returns
 */
function NetworkErrorContent() {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <svg
          className="w-16 h-16 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
      <p className="text-gray-600 mb-4">We&apos;re having trouble connecting. Retrying automatically...</p>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    </div>
  );
}

/**
 * Authentication Error Content
 * Shows when session expires - requires page reload
 */
function AuthErrorContent() {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
      <p className="text-gray-600 mb-6">Your session has expired. Please reload the page to continue.</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        Reload Page
      </button>
    </div>
  );
}

/**
 * Rate Limit Error Content
 * Shows countdown timer - auto-dismisses when countdown reaches 0
 */
function RateLimitContent({ countdown }: { countdown: number }) {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <svg
          className="w-16 h-16 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Too Many Requests</h2>
      <p className="text-gray-600 mb-4">Please wait before trying again.</p>
      <div className="text-4xl font-bold text-yellow-600 tabular-nums">{countdown}s</div>
    </div>
  );
}
