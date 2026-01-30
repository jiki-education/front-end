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
    return <p>Loading...</p>;
  }

  if (error && !preferences) {
    return (
      <div>
        <h1>Email Preferences</h1>
        <p>{error}</p>
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
    <div>
      <h1>Email Preferences</h1>
      <p>Manage which emails you receive from Jiki.</p>

      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}

      <div>
        {emailKey && preferences && (
          <button onClick={() => handleUpdatePreference(emailKey, !currentKeyValue)} disabled={actionLoading}>
            {actionLoading
              ? "Processing..."
              : currentKeyValue
                ? `Unsubscribe from ${formatKeyName(emailKey)}`
                : `Resubscribe to ${formatKeyName(emailKey)}`}
          </button>
        )}

        <button onClick={allUnsubscribed ? handleSubscribeAll : handleUnsubscribeAll} disabled={actionLoading}>
          {actionLoading
            ? "Processing..."
            : allUnsubscribed
              ? "Resubscribe to all emails"
              : "Unsubscribe from all emails"}
        </button>
      </div>

      {isAuthenticated && (
        <>
          <hr />
          <h2>Detailed Preferences</h2>
          <p>Fine-tune your email preferences below.</p>
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
