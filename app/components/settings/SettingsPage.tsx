"use client";

import { useRequireAuth } from "@/lib/auth/hooks";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary theme-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary theme-transition">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-text-secondary">Manage your account preferences and subscription</p>
        </header>

        <main className="space-y-8">
          <SubscriptionSection />
        </main>
      </div>
    </div>
  );
}

function SubscriptionSection() {
  return (
    <section className="bg-bg-secondary rounded-lg p-6 border border-border-primary">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Subscription</h2>
      <p className="text-text-secondary mb-6">Manage your subscription plan and billing details</p>

      <div className="space-y-4">
        <div className="p-4 bg-bg-primary rounded border border-border-secondary">
          <h3 className="font-medium text-text-primary mb-2">Current Plan</h3>
          <p className="text-text-secondary">Free Plan</p>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring">
            Upgrade to Premium
          </button>
          <button className="px-4 py-2 bg-button-secondary-bg text-button-secondary-text border border-button-secondary-border rounded hover:bg-button-secondary-bg-hover transition-colors focus-ring">
            Upgrade to Max
          </button>
        </div>
      </div>
    </section>
  );
}
