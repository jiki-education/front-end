"use client";

import { showConfirmation, showInfo, showModal, showSubscriptionModal, showSubscriptionSuccess } from "@/lib/modal";

export default function TestGlobalModals() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Global Modal System Test</h1>

      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          These modals can be called from anywhere in the app without any setup or context providers. Just import and
          call the functions!
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Example Modal</h2>
          <button
            onClick={() =>
              showModal("example-modal", {
                title: "Global Example",
                message: "This modal is called globally without any orchestrator!"
              })
            }
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Show Example Modal
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Confirmation Modal</h2>
          <button
            onClick={() =>
              showConfirmation({
                title: "Delete Item",
                message: "Are you sure you want to delete this item? This action cannot be undone.",
                confirmText: "Delete",
                cancelText: "Cancel",
                variant: "danger",
                onConfirm: () => alert("Item deleted!"),
                onCancel: () => alert("Cancelled")
              })
            }
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Show Confirmation Modal
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Info Modal</h2>
          <button
            onClick={() =>
              showInfo({
                title: "System Information",
                content: (
                  <div className="space-y-2">
                    <p>The global modal system provides:</p>
                    <ul className="list-disc list-inside pl-4">
                      <li>Simple API - just import and use</li>
                      <li>No context providers needed at component level</li>
                      <li>Works from any page or component</li>
                      <li>TypeScript support</li>
                      <li>Customizable modal types</li>
                    </ul>
                  </div>
                ),
                buttonText: "Awesome!"
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Show Info Modal
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Custom Props</h2>
          <button
            onClick={() =>
              showModal("example-modal", {
                title: "Custom Title",
                message: "You can pass any props to your modals!"
              })
            }
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Show Modal with Custom Props
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Connection Error Modal</h2>
          <button
            onClick={() => showModal("connection-error-modal")}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Show Connection Error Modal
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Exercise Completion Modal</h2>
          <div className="space-x-2 space-y-2">
            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => console.debug("Complete exercise clicked"),
                  onGoToProject: () => console.debug("Go to project clicked"),
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Test Exercise",
                  initialStep: "success"
                })
              }
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            >
              Success Step
            </button>

            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => console.debug("Complete exercise clicked"),
                  onGoToProject: () => console.debug("Go to project clicked"),
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Test Exercise",
                  initialStep: "confirmation"
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Confirmation Step
            </button>

            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => console.debug("Complete exercise clicked"),
                  onGoToProject: () => console.debug("Go to project clicked"),
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Navigate the Maze",
                  initialStep: "difficulty-rating"
                })
              }
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              🆕 Rating Step (Difficulty + Fun)
            </button>

            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => console.debug("Complete exercise clicked"),
                  onGoToProject: () => console.debug("Go to project clicked"),
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Test Exercise",
                  initialStep: "completed"
                })
              }
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Completed Step
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            🆕 Test the new combined rating step! Click through the full flow: Success → Confirmation → Rate Experience
            (Difficulty + Fun) → Completed
          </p>
          <h2 className="text-xl font-semibold mb-2">Subscription Modals</h2>
          <div className="space-x-2 space-y-2">
            <button
              onClick={() =>
                showSubscriptionModal({
                  triggerContext: "chat-gate",
                  suggestedTier: "premium",
                  featuresContext: {
                    feature: "AI Chat Assistant",
                    benefits: [
                      "Get instant help with coding exercises",
                      "Ask questions and receive explanations",
                      "Personalized hints and guidance"
                    ]
                  },
                  onSuccess: (tier) => {
                    showSubscriptionSuccess({
                      tier,
                      triggerContext: "chat-gate",
                      nextSteps: {
                        title: "Start Chatting",
                        description: "Your AI assistant is ready to help with your coding exercises.",
                        buttonText: "Try Chat Now"
                      }
                    });
                  },
                  onCancel: () => console.debug("Subscription cancelled")
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Chat Gate Modal
            </button>

            <button
              onClick={() =>
                showSubscriptionModal({
                  triggerContext: "feature-gate",
                  suggestedTier: "max",
                  featuresContext: {
                    feature: "Advanced Features",
                    benefits: ["Unlimited AI assistance", "Priority support", "Advanced coding exercises"]
                  }
                })
              }
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Feature Gate Modal
            </button>

            <button
              onClick={() =>
                showSubscriptionModal({
                  triggerContext: "general",
                  headline: "Custom Headline",
                  description: "Custom description for general upgrade."
                })
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              General Modal
            </button>

            <button
              onClick={() =>
                showSubscriptionSuccess({
                  tier: "premium",
                  triggerContext: "general"
                })
              }
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Success Modal
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Example:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          {`import { 
  showModal, 
  showConfirmation, 
  showInfo,
  showSubscriptionModal,
  showSubscriptionSuccess 
} from '@/lib/modal';

// Anywhere in your component:
showModal('example-modal', { title: 'Hello!' });

await showConfirmation({
  title: 'Delete?',
  message: 'This cannot be undone',
  onConfirm: () => deleteItem()
});

showInfo({
  title: 'Success',
  content: 'Operation completed!'
});

// Subscription modals:
showSubscriptionModal({
  triggerContext: 'chat-gate',
  suggestedTier: 'premium',
  featuresContext: {
    feature: 'AI Chat Assistant',
    benefits: ['Ask questions', 'Get explanations']
  },
  onSuccess: (tier) => {
    showSubscriptionSuccess({ 
      tier, 
      triggerContext: 'chat-gate' 
    });
  }
});`}
        </pre>
      </div>
    </div>
  );
}
