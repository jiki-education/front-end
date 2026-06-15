"use client";

import { showPremiumUpgradeModal } from "@/lib/modal/app";

export default function PremiumUpgradeModalTest() {
  const handleShowModal = () => {
    showPremiumUpgradeModal("upgrade_cta_nav", {
      onSuccess: () => {
        console.debug("Upgrade successful");
      },
      onCancel: () => {
        console.debug("Upgrade cancelled");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-8">Premium Upgrade Modal Test</h1>
        <button
          onClick={handleShowModal}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          Show Premium Upgrade Modal
        </button>
        <p className="mt-4 text-gray-600">Click the button to test the new premium upgrade modal</p>
      </div>
    </div>
  );
}
