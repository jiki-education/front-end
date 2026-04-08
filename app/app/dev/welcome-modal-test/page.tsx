"use client";

import { showWelcomeModal } from "@/lib/modal";

const WELCOME_SEEN_KEY = "jiki_welcome_seen";

export default function WelcomeModalTestPage() {
  const handleShow = () => {
    showWelcomeModal();
  };

  const handleReset = () => {
    localStorage.removeItem(WELCOME_SEEN_KEY);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome Modal</h1>
      <p className="text-text-secondary mb-8">Test the first-time welcome modal shown to new superusers.</p>

      <div className="flex flex-col gap-4">
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-2 text-text-primary">Show Modal</h2>
          <p className="text-text-secondary text-sm mb-4">Opens the welcome modal directly.</p>
          <button
            onClick={handleShow}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Show Welcome Modal
          </button>
        </div>

        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-2 text-text-primary">Reset localStorage flag</h2>
          <p className="text-text-secondary text-sm mb-4">
            Clears the <code className="font-mono text-xs bg-bg-tertiary px-1 py-0.5 rounded">{WELCOME_SEEN_KEY}</code>{" "}
            key so the modal will trigger again on next page load.
          </p>
          <button
            onClick={handleReset}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Reset &quot;seen&quot; flag
          </button>
        </div>
      </div>
    </div>
  );
}
