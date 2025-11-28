"use client";

import { showSubscriptionModal } from "@/lib/modal";
import { useAuthStore } from "@/stores/authStore";

interface ChatPremiumUpgradeProps {
  className?: string;
}

export default function ChatPremiumUpgrade({ className = "" }: ChatPremiumUpgradeProps) {
  const { refreshUser } = useAuthStore();

  const handleUpgradeClick = () => {
    showSubscriptionModal({
      triggerContext: "chat-gate",
      featuresContext: {
        feature: "AI Chat Assistant",
        benefits: [
          "Get instant help with coding exercises",
          "Ask questions and receive explanations",
          "Personalized hints and guidance",
          "Debug your code with AI assistance"
        ]
      },
      suggestedTier: "premium",
      onSuccess: () => {
        // Refresh auth state when subscription is successful
        void refreshUser();
      }
    });
  };

  return (
    <div className={`bg-bg-primary h-full flex flex-col ${className}`}>
      <div className="border-b border-border-primary px-4 py-2">
        <h2 className="text-lg font-semibold text-text-primary">Chat</h2>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-border-secondary">
              <svg
                className="w-8 h-8 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">AI Chat Assistant</h3>
            <p className="text-text-secondary text-sm mb-6">
              This feature is only available to Premium subscribers. Get instant help with your coding exercises from
              our AI assistant.
            </p>
          </div>

          {/* Premium Upgrade Button - same style as sidebar */}
          <button
            onClick={handleUpgradeClick}
            className="premium-upgrade-btn"
            style={{
              marginTop: "auto",
              padding: "14px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              textDecoration: "none",
              fontFamily: '"Poppins", sans-serif',
              width: "100%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
          >
            <span
              style={{
                fontSize: "20px",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ⭐
            </span>
            <span>Upgrade to Premium</span>
          </button>
        </div>
      </div>
    </div>
  );
}
