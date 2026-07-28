"use client";

// Dev page uses setState in useEffect to track component lifecycle for debugging

import { keyboard, useKeyboard } from "@/lib/keyboard";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function KeyboardNavigationTestPage() {
  const [log, setLog] = useState<string[]>([]);
  const [registeredCount, setRegisteredCount] = useState(0);

  const addLog = (message: string) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev].slice(0, 20));
  };

  // Register a module-level shortcut to track if it persists across navigation
  useEffect(() => {
    const unsubscribe = keyboard.on("ctrl+t", () => {
      addLog("Module-level: Ctrl+T pressed");
    });

    addLog("Module-level shortcut registered");
    setRegisteredCount((c) => c + 1);

    return () => {
      addLog("Module-level shortcut cleanup");
      unsubscribe();
    };
  }, []);

  // Component-level shortcut using the hook
  useKeyboard(
    "ctrl+h",
    () => {
      addLog("Hook-level: Ctrl+H pressed");
    },
    { description: "Test hook shortcut" }
  );

  // Track component lifecycle
  useEffect(() => {
    addLog("Component mounted");

    // Check current event listeners
    const checkListeners = () => {
      // @ts-ignore - accessing private for debugging
      const listeners = window.getEventListeners ? window.getEventListeners(window) : null;
      if (listeners) {
        addLog(`Window has ${listeners.keydown?.length || 0} keydown listeners`);
      }
    };

    checkListeners();

    return () => {
      addLog("Component unmounting");
      checkListeners();
    };
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Keyboard Navigation Test</h1>

      <div className={styles.instructions}>
        <h2 className={styles.sectionTitle}>Test Instructions</h2>
        <ol className={styles.instructionList}>
          <li>
            1. Press <kbd>Ctrl+T</kbd> and <kbd>Ctrl+H</kbd> to test shortcuts work
          </li>
          <li>2. Navigate to another page using the links below</li>
          <li>3. Navigate back using browser back button or links</li>
          <li>4. Try shortcuts again to see if they still work or cause issues</li>
          <li>5. Check browser console for any memory leaks or errors</li>
        </ol>
      </div>

      <div className={styles.links}>
        <Link href="/dev" className={styles.link}>
          Go to Dev Index
        </Link>
        <Link href="/dev/test-keyboard" className={styles.link}>
          Go to Keyboard Test
        </Link>
        <Link href="/" className={styles.link}>
          Go to Home
        </Link>
      </div>

      <div className={styles.counter}>
        <p>Shortcuts registered: {registeredCount} times</p>
        <p className={styles.counterNote}>If this number increases after navigation, we have a memory leak</p>
      </div>

      <div className={styles.logPanel}>
        <h2 className={styles.logTitle}>Event Log</h2>
        {log.length === 0 ? (
          <p className={styles.logEmpty}>No events yet</p>
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
