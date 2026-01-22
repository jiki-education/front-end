"use client";

import { showSubscriptionModal, showSubscriptionSuccess } from "@/lib/modal";

export default function SubscriptionModalTest() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Subscription Modal Test</h1>

      <div className="mb-8">
        <p className="text-text-secondary mb-4">
          Test the new global subscription modal system with different contexts and configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chat Gate Modal */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Chat Gate Context</h2>
          <p className="text-text-secondary text-sm mb-4">
            Simulates the modal triggered when users try to access AI chat without premium.
          </p>
          <button
            onClick={() =>
              showSubscriptionModal({
                triggerContext: "chat-gate",
                suggestedTier: "premium",
                featuresContext: {
                  feature: "AI Chat Assistant",
                  benefits: [
                    "Get instant help with your coding exercises",
                    "Ask questions and receive detailed explanations",
                    "Receive personalized hints and guidance",
                    "Debug your code with AI assistance"
                  ]
                },
                onSuccess: (tier) => {
                  showSubscriptionSuccess({
                    tier,
                    triggerContext: "chat-gate",
                    nextSteps: {
                      title: "Start Chatting Now!",
                      description: "Your AI assistant is ready to help with your coding exercises.",
                      buttonText: "Try Chat Now",
                      action: () => console.debug("Redirecting to chat...")
                    }
                  });
                },
                onCancel: () => console.debug("Chat gate subscription cancelled")
              })
            }
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🤖 Trigger Chat Gate Modal
          </button>
        </div>

        {/* Feature Gate Modal */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Feature Gate Context</h2>
          <p className="text-text-secondary text-sm mb-4">
            When users try to access premium features like advanced exercises or priority support.
          </p>
          <button
            onClick={() =>
              showSubscriptionModal({
                triggerContext: "feature-gate",
                suggestedTier: "max",
                featuresContext: {
                  feature: "Advanced Learning Features",
                  benefits: [
                    "Access to advanced coding exercises",
                    "Unlimited AI assistance and hints",
                    "Priority support and faster response times",
                    "One-on-one mentorship sessions",
                    "Career guidance and interview prep"
                  ]
                },
                onSuccess: (tier) => {
                  showSubscriptionSuccess({
                    tier,
                    triggerContext: "feature-gate",
                    nextSteps: {
                      title: "Explore Your New Features",
                      description: "Discover all the advanced features now available to you.",
                      buttonText: "Browse Features"
                    }
                  });
                }
              })
            }
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            ⭐ Trigger Feature Gate Modal
          </button>
        </div>

        {/* Settings Context */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Settings Context</h2>
          <p className="text-text-secondary text-sm mb-4">
            Clean subscription selection from settings page - no specific feature context.
          </p>
          <button
            onClick={() =>
              showSubscriptionModal({
                triggerContext: "settings",
                onSuccess: (tier) => {
                  showSubscriptionSuccess({
                    tier,
                    triggerContext: "settings"
                  });
                }
              })
            }
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ⚙️ Trigger Settings Modal
          </button>
        </div>

        {/* General Context */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">General Context</h2>
          <p className="text-text-secondary text-sm mb-4">
            Default modal without specific feature context or suggestions.
          </p>
          <button
            onClick={() =>
              showSubscriptionModal({
                triggerContext: "general"
              })
            }
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            🚀 Trigger General Modal
          </button>
        </div>

        {/* Custom Content */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Custom Content</h2>
          <p className="text-text-secondary text-sm mb-4">Modal with completely custom headline and description.</p>
          <button
            onClick={() =>
              showSubscriptionModal({
                triggerContext: "general",
                headline: "Unlock Your Potential!",
                description: "Take your coding skills to the next level with our premium learning platform.",
                suggestedTier: "premium"
              })
            }
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            ✨ Custom Content Modal
          </button>
        </div>

        {/* Success Modal Only */}
        <div className="border border-border-secondary rounded-lg p-6 bg-bg-secondary">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Success Modal</h2>
          <p className="text-text-secondary text-sm mb-4">
            Test the success modal independently with different configurations.
          </p>
          <div className="space-y-2">
            <button
              onClick={() =>
                showSubscriptionSuccess({
                  tier: "premium",
                  triggerContext: "general"
                })
              }
              className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
            >
              Premium Success
            </button>
            <button
              onClick={() =>
                showSubscriptionSuccess({
                  tier: "premium",
                  triggerContext: "chat-gate",
                  nextSteps: {
                    title: "Get Started with AI Chat",
                    description: "Your AI assistant is now ready to help you learn.",
                    buttonText: "Start Learning",
                    action: () => console.debug("Starting learning journey...")
                  }
                })
              }
              className="w-full px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors text-sm"
            >
              Premium Success + Next Steps
            </button>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-12 bg-bg-secondary p-6 rounded-lg border border-border-secondary">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">Integration Examples</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-text-primary">Simple Usage</h4>
            <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
              {`// From any component:
import { showSubscriptionModal } from '@/lib/modal';

// Basic modal
showSubscriptionModal({
  triggerContext: 'chat-gate'
});`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-text-primary">Advanced Usage</h4>
            <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
              {`// Full configuration
showSubscriptionModal({
  triggerContext: 'feature-gate',
  suggestedTier: 'premium',
  featuresContext: {
    feature: 'AI Chat Assistant',
    benefits: [
      'Ask questions',
      'Get explanations'
    ]
  },
  onSuccess: (tier) => {
    // Handle success
    showSubscriptionSuccess({ tier });
  }
});`}
            </pre>
          </div>
        </div>
      </div>

      {/* Testing Notes */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Testing Notes</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>
            • <strong>Context-aware messaging:</strong> Each trigger shows different headlines and descriptions
          </li>
          <li>
            • <strong>Tier suggestions:</strong> Premium suggested for chat, Max for advanced features
          </li>
          <li>
            • <strong>Feature benefits:</strong> Contextual benefits shown when featuresContext is provided
          </li>
          <li>
            • <strong>Real Stripe integration:</strong> Clicking upgrade buttons creates actual Stripe checkout sessions
          </li>
          <li>
            • <strong>Checkout flow:</strong> Modal transitions to real Stripe payment form
          </li>
          <li>
            • <strong>Success flow:</strong> Success modal automatically triggered after subscription
          </li>
          <li>
            • <strong>Next steps:</strong> Optional post-subscription guidance
          </li>
          <li>
            • <strong>Mobile responsive:</strong> Test on different screen sizes
          </li>
          <li>
            • <strong>Accessibility:</strong> Tab navigation and screen reader support
          </li>
        </ul>
      </div>

      {/* Current State */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-3 text-yellow-900">Current Implementation Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-800 text-sm">
          <div>
            <h4 className="font-medium mb-2">✅ Completed</h4>
            <ul className="space-y-1">
              <li>• Modal components created</li>
              <li>• Context-aware messaging</li>
              <li>• Tier selection interface</li>
              <li>• Success modal with next steps</li>
              <li>• Global modal system integration</li>
              <li>
                • <strong>Real Stripe checkout integration</strong>
              </li>
              <li>• TypeScript + ESLint compliance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🚧 Next Steps (Phase 2-3)</h4>
            <ul className="space-y-1">
              <li>• Replace ChatPremiumUpgrade component</li>
              <li>• Create FeatureGate component</li>
              <li>• Add analytics tracking</li>
              <li>• A/B testing framework</li>
              <li>• Smart tier recommendations</li>
              <li>• Payment success handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
