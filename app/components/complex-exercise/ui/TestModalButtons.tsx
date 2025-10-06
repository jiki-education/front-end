"use client";

import { showModal } from "@/lib/modal";

export function TestModalButtons() {
  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          showModal("example-modal", {
            title: "Test Modal",
            message: "This is a test of the modal system!"
          })
        }
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Example Modal
      </button>
      <button
        onClick={() =>
          showModal("confirmation-modal", {
            title: "Confirm Reset",
            message: "Are you sure you want to reset the code to the default?",
            confirmText: "Reset",
            cancelText: "Keep my code",
            variant: "danger",
            onConfirm: () => {
              // In a real app, this would reset the code
            },
            onCancel: () => {
              // User cancelled the reset
            }
          })
        }
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
      >
        Confirmation Modal
      </button>
      <button
        onClick={() =>
          showModal("info-modal", {
            title: "About This Exercise",
            content: (
              <div className="space-y-2">
                <p>This is a complex exercise that demonstrates:</p>
                <ul className="list-disc list-inside pl-4">
                  <li>Code editing with CodeMirror</li>
                  <li>Test execution and visualization</li>
                  <li>Timeline scrubbing</li>
                  <li>Modal management</li>
                </ul>
              </div>
            ),
            buttonText: "Cool!"
          })
        }
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        Info Modal
      </button>
    </div>
  );
}
