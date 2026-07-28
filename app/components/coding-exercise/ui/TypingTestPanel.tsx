"use client";

import { useState, useCallback } from "react";
import TypeItAssistantMessage from "./TypeItAssistantMessage";
import type { StreamStatus } from "../lib/chat-types";
import styles from "./TypingTestPanel.module.css";

const STATUS_BADGE_CLASS: Record<StreamStatus, string> = {
  idle: styles.statusBadgeIdle,
  thinking: styles.statusBadgeThinking,
  typing: styles.statusBadgeTyping,
  error: styles.statusBadgeError
};

/**
 * Test panel for debugging the typing mechanism without API calls.
 * Simulates the real chat flow with controllable timing.
 */
export default function TypingTestPanel() {
  const [currentResponse, setCurrentResponse] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [typingSpeed, setTypingSpeed] = useState(50);

  const simulateThinking = useCallback(() => {
    setCurrentResponse("");
    setStatus("thinking");
  }, []);

  const simulateTyping = useCallback(() => {
    const fullMessage =
      "This is a test message that demonstrates the typing effect using typeit-react. Watch as each character appears with a natural typing rhythm, creating an engaging user experience.";
    setCurrentResponse(fullMessage);
    setStatus("typing");

    // After typing completes, set status to idle
    const typingDuration = fullMessage.length * typingSpeed;
    setTimeout(() => {
      setStatus("idle");
    }, typingDuration);
  }, [typingSpeed]);

  const simulateInstantText = useCallback(() => {
    const fullMessage = "This message appears instantly without typing effect.";
    setCurrentResponse(fullMessage);
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    setCurrentResponse("");
    setStatus("idle");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Typing Effect Test Panel</h2>
          <p className={styles.cardSubtitle}>Test the typing mechanism without expensive API calls</p>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.buttonRow}>
            <button
              onClick={simulateThinking}
              disabled={status !== "idle"}
              className={`${styles.actionButton} ${styles.actionButtonBlue}`}
            >
              1. Start Thinking
            </button>

            <button
              onClick={simulateTyping}
              disabled={status !== "thinking"}
              className={`${styles.actionButton} ${styles.actionButtonGreen}`}
            >
              2. Start Typing
            </button>

            <button
              onClick={simulateInstantText}
              disabled={status !== "idle"}
              className={`${styles.actionButton} ${styles.actionButtonPurple}`}
            >
              Test Instant
            </button>

            <button onClick={reset} className={`${styles.actionButton} ${styles.actionButtonGray}`}>
              Reset
            </button>
          </div>

          <div className={styles.speedRow}>
            <label className={styles.speedLabel}>Typing Speed:</label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={typingSpeed}
              onChange={(e) => setTypingSpeed(Number(e.target.value))}
              className={styles.speedInput}
            />
            <span className={styles.speedValue}>{typingSpeed}ms per character</span>
          </div>
        </div>

        {/* Status Display */}
        <div className={styles.statusBar}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status:</span>
            <span className={`${styles.statusBadge} ${STATUS_BADGE_CLASS[status]}`}>{status.toUpperCase()}</span>
            <span className={styles.statusMeta}>Content Length: {currentResponse.length}</span>
          </div>
        </div>
      </div>

      {/* Message Display Area */}
      <div className={styles.displayCard}>
        <h3 className={styles.displayTitle}>Message Display:</h3>

        {(currentResponse || status === "thinking") && (
          <TypeItAssistantMessage
            content={currentResponse}
            status={status}
            typingSpeed={typingSpeed}
            onTypingComplete={() => setStatus("idle")}
          />
        )}

        {!currentResponse && status === "idle" && (
          <div className={styles.emptyDisplay}>
            No message to display. Click &quot;Start Thinking&ldquo; to begin test.
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className={styles.debugCard}>
        <h3 className={styles.debugTitle}>Debug Info:</h3>
        <div className={styles.debugList}>
          <div>Status: {status}</div>
          <div>Content: &quot;{currentResponse}&quot;</div>
          <div>Content Length: {currentResponse.length} chars</div>
          <div>Should Type: {currentResponse && status === "typing" ? "YES" : "NO"}</div>
        </div>
      </div>
    </div>
  );
}
