"use client";

import { useState } from "react";
import UnsubscribeFromEmailSection from "@/components/unsubscribe/UnsubscribeFromEmailSection";
import UnsubscribeFromAllSection from "@/components/unsubscribe/UnsubscribeFromAllSection";
import ManageNotificationsSection from "@/components/unsubscribe/ManageNotificationsSection";
import type { EmailPreferences } from "@/lib/api/emailPreferences";
import styles from "@/components/unsubscribe/UnsubscribePage.module.css";

type ActionState = "idle" | "loading" | "success" | "error";

export default function UnsubscribeDevPage() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    newsletters: true,
    event_emails: true,
    milestone_emails: false,
    activity_emails: true
  });
  const [emailKeyState, setEmailKeyState] = useState<ActionState>("idle");
  const [allState, setAllState] = useState<ActionState>("idle");
  const [preferencesState, setPreferencesState] = useState<ActionState>("idle");

  const simulateAction = (setState: (state: ActionState) => void, callback?: () => void, shouldError = false) => {
    setState("loading");
    setTimeout(() => {
      if (shouldError) {
        setState("error");
      } else {
        callback?.();
        setState("success");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Unsubscribe Page - Dev Testing</h1>
          <p className="text-gray-600 mb-4">
            This page allows you to test the unsubscribe UI components in various states.
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              className="ui-btn ui-btn-small ui-btn-secondary"
              onClick={() => {
                setEmailKeyState("idle");
                setAllState("idle");
                setPreferencesState("idle");
              }}
            >
              Reset All States
            </button>
            <button
              className="ui-btn ui-btn-small ui-btn-secondary"
              onClick={() =>
                setPreferences({
                  newsletters: true,
                  event_emails: true,
                  milestone_emails: true,
                  activity_emails: true
                })
              }
            >
              Subscribe All
            </button>
            <button
              className="ui-btn ui-btn-small ui-btn-secondary"
              onClick={() =>
                setPreferences({
                  newsletters: false,
                  event_emails: false,
                  milestone_emails: false,
                  activity_emails: false
                })
              }
            >
              Unsubscribe All
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="ui-btn ui-btn-small ui-btn-danger" onClick={() => setEmailKeyState("error")}>
              Simulate Email Key Error
            </button>
            <button className="ui-btn ui-btn-small ui-btn-danger" onClick={() => setAllState("error")}>
              Simulate All Error
            </button>
          </div>
        </div>

        {/* Actual Unsubscribe Page UI */}
        <div className={`${styles.pageBackground} rounded-lg shadow-sm p-6`}>
          <div className={styles.pageWrapper}>
            <header className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Email Preferences</h1>
              <p className={styles.pageSubtitle}>Manage how and when we communicate with you.</p>
            </header>

            <div className={styles.contentLayout}>
              <UnsubscribeFromEmailSection
                emailKey="newsletters"
                isSubscribed={preferences.newsletters}
                loading={emailKeyState === "loading"}
                success={emailKeyState === "success"}
                error={emailKeyState === "error"}
                onUnsubscribe={() => {
                  simulateAction(setEmailKeyState, () => {
                    setPreferences((prev) => ({ ...prev, newsletters: false }));
                  });
                }}
              />

              <UnsubscribeFromAllSection
                loading={allState === "loading"}
                success={allState === "success"}
                error={allState === "error"}
                onUnsubscribe={() => {
                  simulateAction(setAllState, () => {
                    setPreferences({
                      newsletters: false,
                      event_emails: false,
                      milestone_emails: false,
                      activity_emails: false
                    });
                  });
                }}
              />

              <ManageNotificationsSection
                preferences={preferences}
                loading={preferencesState === "loading"}
                onSave={(newPreferences) => {
                  simulateAction(setPreferencesState, () => {
                    setPreferences(newPreferences);
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* State Display */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Current State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ preferences, emailKeyState, allState, preferencesState }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
