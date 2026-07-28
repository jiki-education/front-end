"use client";

import { keyboard, useKeyboard } from "@/lib/keyboard";
import { showModal } from "@/lib/modal";
import { useState } from "react";
import styles from "./page.module.css";

// Register some global shortcuts at module level
// These persist for the entire app lifetime
keyboard.on("?", () => keyboard.showHelp(), {
  description: "Show keyboard shortcuts help"
});

keyboard.on(
  "cmd+k",
  () => {
    showModal("info-modal", {
      title: "Command Palette",
      content: "This would open a command palette!"
    });
  },
  { description: "Open command palette" }
);

export default function TestKeyboardPage() {
  const [log, setLog] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [scopedActive, setScopedActive] = useState(false);

  const addLog = (message: string) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev].slice(0, 10));
  };

  const startRecording = () => {
    setIsRecording(true);
    addLog("Started recording keyboard shortcuts");
  };

  const stopRecording = () => {
    setIsRecording(false);
    addLog("Stopped recording keyboard shortcuts");
  };

  const toggleScope = () => {
    setScopedActive(!scopedActive);
    addLog(scopedActive ? "Deactivated modal scope" : "Activated modal scope");
  };

  useKeyboard(
    "escape",
    () => {
      if (scopedActive) {
        addLog("Modal: Escape pressed (would close modal)");
        toggleScope();
      } else if (isRecording) {
        addLog("Escape pressed!");
        stopRecording();
      }
    },
    { description: scopedActive ? "Close modal" : "Stop recording", enabled: isRecording || scopedActive }
  );

  useKeyboard(
    "space",
    (e) => {
      e.preventDefault();
      addLog("Space pressed!");
    },
    { description: "Log space press", enabled: isRecording }
  );

  useKeyboard(
    "cmd+s",
    (e) => {
      e.preventDefault();
      addLog("Save shortcut triggered!");
    },
    { description: "Save (prevented default)", enabled: isRecording }
  );

  useKeyboard("up", () => addLog("Up arrow pressed"), { description: "Navigate up", enabled: isRecording });
  useKeyboard("down", () => addLog("Down arrow pressed"), { description: "Navigate down", enabled: isRecording });
  useKeyboard("left", () => addLog("Left arrow pressed"), { description: "Navigate left", enabled: isRecording });
  useKeyboard("right", () => addLog("Right arrow pressed"), {
    description: "Navigate right",
    enabled: isRecording
  });

  useKeyboard(
    "g g",
    () => {
      addLog("Double G pressed! (Vim-style)");
    },
    { description: "Go to top (Vim-style)", enabled: isRecording }
  );

  useKeyboard(
    "shift+g shift+g",
    () => {
      addLog("Double Shift+G pressed!");
    },
    { description: "Go to bottom (Vim-style)", enabled: isRecording }
  );

  useKeyboard(
    "enter",
    () => {
      addLog("Modal: Enter pressed (would confirm)");
    },
    {
      scope: "modal",
      description: "Confirm modal action",
      enabled: scopedActive
    }
  );

  useKeyboard(
    "tab",
    (e) => {
      e.preventDefault();
      addLog("Modal: Tab pressed (focus trap)");
    },
    {
      scope: "modal",
      description: "Navigate modal elements",
      enabled: scopedActive
    }
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Keyboard Shortcuts Test</h1>

      <div className={styles.globalCard}>
        <h2 className={styles.globalTitle}>Global Shortcuts (Always Active)</h2>
        <ul className={styles.globalList}>
          <li>
            <kbd className={styles.kbd}>?</kbd> - Show keyboard help
          </li>
          <li>
            <kbd className={styles.kbd}>⌘K</kbd> - Open command palette
          </li>
        </ul>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttonRow}>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={styles.recordButton}
            data-active={isRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording Shortcuts"}
          </button>

          <button onClick={toggleScope} className={styles.scopeButton} data-active={scopedActive}>
            {scopedActive ? "Deactivate Modal Scope" : "Activate Modal Scope"}
          </button>

          <button onClick={() => setLog([])} className={styles.clearButton}>
            Clear Log
          </button>
        </div>

        {isRecording && (
          <div className={styles.recordingBox}>
            <h3 className={styles.recordingTitle}>Recording Active!</h3>
            <p className={styles.recordingIntro}>Try these shortcuts:</p>
            <ul className={styles.recordingList}>
              <li>
                • <kbd>Escape</kbd> - Stop recording
              </li>
              <li>
                • <kbd>Space</kbd> - Log space press
              </li>
              <li>
                • <kbd>⌘S</kbd> - Save (prevented)
              </li>
              <li>
                • <kbd>Arrow Keys</kbd> - Navigation
              </li>
              <li>
                • <kbd>G G</kbd> - Vim-style chord (press G twice quickly)
              </li>
              <li>
                • <kbd>Shift+G Shift+G</kbd> - Another chord
              </li>
            </ul>
          </div>
        )}

        {scopedActive && (
          <div className={styles.scopeBox}>
            <h3 className={styles.scopeTitle}>Modal Scope Active!</h3>
            <p className={styles.scopeIntro}>Modal-specific shortcuts:</p>
            <ul className={styles.scopeList}>
              <li>
                • <kbd>Escape</kbd> - Close modal (deactivates scope)
              </li>
              <li>
                • <kbd>Enter</kbd> - Confirm action
              </li>
              <li>
                • <kbd>Tab</kbd> - Navigate (trapped)
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.inputSection}>
        <h2 className={styles.inputTitle}>Test in Input Field</h2>
        <input type="text" placeholder="Type here - shortcuts are disabled while typing" className={styles.input} />
        <p className={styles.inputHint}>Most shortcuts are automatically disabled when typing in inputs</p>
      </div>

      <div className={styles.logCard}>
        <h2 className={styles.logTitle}>Event Log</h2>
        {log.length === 0 ? (
          <p className={styles.logEmpty}>No events yet. Try the shortcuts above!</p>
        ) : (
          <div className={styles.logEntries}>
            {log.map((entry, i) => (
              <div key={i} className={styles.logEntry}>
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
