"use client";

import { showModal } from "@/lib/modal";
import styles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";

export default function PremiumUpgradeModalTest() {
  const handleShowModal = () => {
    showModal(
      "premium-upgrade-modal",
      {
        onSuccess: () => {
          console.debug("Upgrade successful");
        },
        onCancel: () => {
          console.debug("Upgrade cancelled");
        }
      },
      undefined, // overlayClassName
      styles.premiumModalWidth // modalClassName
    );
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
