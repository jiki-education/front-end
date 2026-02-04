import { useEffect, useState } from "react";
import {
  getEmailPreferences,
  updateEmailPreference,
  updateEmailPreferences,
  unsubscribeAll,
  type EmailPreferences
} from "@/lib/api/emailPreferences";

type ActionState = "idle" | "loading" | "success" | "error";

interface ActionStates {
  emailKey: ActionState;
  all: ActionState;
  preferences: ActionState;
}

export function useEmailPreferences(token: string) {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionStates, setActionStates] = useState<ActionStates>({
    emailKey: "idle",
    all: "idle",
    preferences: "idle"
  });

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const prefs = await getEmailPreferences(token);
        setPreferences(prefs);
      } catch {
        setLoadError("Unable to load your email preferences. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    }
    void fetchPreferences();
  }, [token]);

  const handleUpdatePreference = async (key: keyof EmailPreferences, value: boolean) => {
    setActionStates((prev) => ({ ...prev, emailKey: "loading" }));
    try {
      const updatedPrefs = await updateEmailPreference(token, key, value);
      setPreferences(updatedPrefs);
      setActionStates((prev) => ({ ...prev, emailKey: "success" }));
    } catch {
      setActionStates((prev) => ({ ...prev, emailKey: "error" }));
    }
  };

  const handleSavePreferences = async (newPreferences: EmailPreferences) => {
    setActionStates((prev) => ({ ...prev, preferences: "loading" }));
    try {
      const updatedPrefs = await updateEmailPreferences(token, newPreferences);
      setPreferences(updatedPrefs);
      setActionStates((prev) => ({ ...prev, preferences: "success" }));
    } catch {
      setActionStates((prev) => ({ ...prev, preferences: "error" }));
    }
  };

  const handleUnsubscribeAll = async () => {
    setActionStates((prev) => ({ ...prev, all: "loading" }));
    try {
      const updatedPrefs = await unsubscribeAll(token);
      setPreferences(updatedPrefs);
      setActionStates((prev) => ({ ...prev, all: "success" }));
    } catch {
      setActionStates((prev) => ({ ...prev, all: "error" }));
    }
  };

  return {
    preferences,
    loading,
    loadError,
    actionStates,
    handleUpdatePreference,
    handleSavePreferences,
    handleUnsubscribeAll
  };
}
