"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import {
  getEmailPreferences,
  updateEmailPreference,
  unsubscribeAll,
  subscribeAll,
  type EmailPreferences
} from "@/lib/api/emailPreferences";
import NotificationsTab from "@/components/settings/tabs/NotificationsTab";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UnsubscribePageProps {
  token: string;
  emailKey?: string;
}

export default function UnsubscribePage({ token, emailKey }: UnsubscribePageProps) {
  const { isAuthenticated } = useAuthStore();
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const prefs = await getEmailPreferences(token);
        setPreferences(prefs);
      } catch {
        setError("Unable to load your email preferences. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    }
    void fetchPreferences();
  }, [token]);

  const handleUpdatePreference = async (key: string, value: boolean) => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updatedPrefs = await updateEmailPreference(token, key, value);
      setPreferences(updatedPrefs);
      setSuccessMessage(
        value
          ? `You've been resubscribed to ${formatKeyName(key)}.`
          : `You've been unsubscribed from ${formatKeyName(key)}.`
      );
    } catch {
      setError("Failed to update your preferences. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updatedPrefs = await unsubscribeAll(token);
      setPreferences(updatedPrefs);
      setSuccessMessage("You've been unsubscribed from all emails.");
    } catch {
      setError("Failed to update your preferences. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubscribeAll = async () => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updatedPrefs = await subscribeAll(token);
      setPreferences(updatedPrefs);
      setSuccessMessage("You've been resubscribed to all emails.");
    } catch {
      setError("Failed to update your preferences. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !preferences) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Email Preferences</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const allUnsubscribed =
    preferences &&
    !preferences.newsletters &&
    !preferences.event_emails &&
    !preferences.milestone_emails &&
    !preferences.activity_emails;
  const currentKeyValue = emailKey && preferences ? preferences[emailKey as keyof EmailPreferences] : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Email Preferences</h1>
      <p className="text-gray-600 mb-8">Manage which emails you receive from Jiki.</p>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="space-y-4">
        {emailKey && preferences && (
          <button
            onClick={() => handleUpdatePreference(emailKey, !currentKeyValue)}
            disabled={actionLoading}
            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded font-medium disabled:opacity-50"
          >
            {actionLoading
              ? "Processing..."
              : currentKeyValue
                ? `Unsubscribe from ${formatKeyName(emailKey)}`
                : `Resubscribe to ${formatKeyName(emailKey)}`}
          </button>
        )}

        <button
          onClick={allUnsubscribed ? handleSubscribeAll : handleUnsubscribeAll}
          disabled={actionLoading}
          className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded font-medium disabled:opacity-50"
        >
          {actionLoading
            ? "Processing..."
            : allUnsubscribed
              ? "Resubscribe to all emails"
              : "Unsubscribe from all emails"}
        </button>
      </div>

      {isAuthenticated && (
        <>
          <hr className="my-12" />
          <h2 className="text-xl font-bold mb-4">Detailed Preferences</h2>
          <p className="text-gray-600 mb-6">Fine-tune your email preferences below.</p>
          <NotificationsTab />
        </>
      )}
    </div>
  );
}

function formatKeyName(key: string): string {
  const names: Record<string, string> = {
    newsletters: "newsletters",
    event_emails: "event emails",
    milestone_emails: "milestone emails",
    activity_emails: "activity emails"
  };
  return names[key] || key;
}
