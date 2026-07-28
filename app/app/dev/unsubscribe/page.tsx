"use client";

import { useState } from "react";
import UnsubscribeFromEmailSection from "@/components/unsubscribe/UnsubscribeFromEmailSection";
import UnsubscribeFromAllSection from "@/components/unsubscribe/UnsubscribeFromAllSection";
import ManageNotificationsSection from "@/components/unsubscribe/ManageNotificationsSection";
import type { EmailPreferences } from "@/lib/api/emailPreferences";
import { buildEmailPreferences } from "@/lib/notifications/config";
import styles from "@/components/unsubscribe/UnsubscribePage.module.css";
import dev from "./page.module.css";

type ActionState = "idle" | "loading" | "success" | "error";

export default function UnsubscribeDevPage() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    ...buildEmailPreferences(true),
    milestone_emails: false
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
    <div className={dev.page}>
      <div className={dev.container}>
        <div className={dev.panel}>
          <h1 className={dev.panelTitle}>Unsubscribe Page - Dev Testing</h1>
          <p className={dev.panelText}>This page allows you to test the unsubscribe UI components in various states.</p>

          <div className={dev.buttonRow}>
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
              onClick={() => setPreferences(buildEmailPreferences(true))}
            >
              Subscribe All
            </button>
            <button
              className="ui-btn ui-btn-small ui-btn-secondary"
              onClick={() => setPreferences(buildEmailPreferences(false))}
            >
              Unsubscribe All
            </button>
          </div>

          <div className={dev.buttonRowLast}>
            <button className="ui-btn ui-btn-small ui-btn-danger" onClick={() => setEmailKeyState("error")}>
              Simulate Email Key Error
            </button>
            <button className="ui-btn ui-btn-small ui-btn-danger" onClick={() => setAllState("error")}>
              Simulate All Error
            </button>
          </div>
        </div>

        {/* Actual Unsubscribe Page UI */}
        <div className={`${styles.pageBackground} ${dev.previewShell}`}>
          <div className={styles.pageWrapper}>
            <div className={styles.innerContent}>
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
                      setPreferences(buildEmailPreferences(false));
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
        </div>

        {/* State Display */}
        <div className={dev.statePanel}>
          <h2 className={dev.stateTitle}>Current State</h2>
          <pre className={dev.statePre}>
            {JSON.stringify({ preferences, emailKeyState, allState, preferencesState }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
