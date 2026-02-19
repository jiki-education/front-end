"use client";

import { showPaymentProcessing, showWelcomeToPremium } from "@/lib/modal";

export default function SubscriptionModalTest() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Payment Flow Modals</h1>
      <p className="text-text-secondary mb-8">Test the payment processing and welcome to premium modals for styling.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Processing Modal */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Payment Processing</h2>
          <p className="text-text-secondary text-sm mb-4">
            Shown when payment is pending confirmation from the provider (e.g., PayPal, BACS).
          </p>
          <button
            onClick={() =>
              showPaymentProcessing({
                onClose: () => console.debug("Payment processing modal closed")
              })
            }
            className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Show Payment Processing
          </button>
        </div>

        {/* Welcome to Premium Modal */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Welcome to Premium</h2>
          <p className="text-text-secondary text-sm mb-4">
            Shown after successful payment confirmation. The &quot;Welcome to Premium&quot; success state.
          </p>
          <button
            onClick={() => showWelcomeToPremium()}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Show Welcome Modal
          </button>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="mt-8 bg-bg-secondary p-6 rounded-lg border border-border-secondary">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Payment Flow</h3>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">Checkout Form</div>
          <span className="text-text-tertiary">→</span>
          <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg border border-amber-200">
            Payment Processing
          </div>
          <span className="text-text-tertiary">→</span>
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
            Welcome to Premium
          </div>
        </div>
        <p className="text-text-tertiary text-xs text-center mt-4">
          Payment Processing is shown when status is pending. Welcome modal is shown when payment is confirmed.
        </p>
      </div>
    </div>
  );
}
