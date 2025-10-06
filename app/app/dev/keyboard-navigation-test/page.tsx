"use client";

import { keyboard, useKeyboard } from "@/lib/keyboard";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Keyboard Navigation Test</h1>

      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Instructions</h2>
        <ol className="text-sm space-y-2">
          <li>
            1. Press <kbd>Ctrl+T</kbd> and <kbd>Ctrl+H</kbd> to test shortcuts work
          </li>
          <li>2. Navigate to another page using the links below</li>
          <li>3. Navigate back using browser back button or links</li>
          <li>4. Try shortcuts again to see if they still work or cause issues</li>
          <li>5. Check browser console for any memory leaks or errors</li>
        </ol>
      </div>

      <div className="mb-8 space-x-4">
        <Link href="/dev" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Dev Index
        </Link>
        <Link href="/dev/test-keyboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Keyboard Test
        </Link>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Home
        </Link>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Shortcuts registered: {registeredCount} times</p>
        <p className="text-sm text-gray-600 mt-2">If this number increases after navigation, we have a memory leak</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Event Log</h2>
        {log.length === 0 ? (
          <p className="text-gray-400 text-sm">No events yet</p>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {log.map((entry, i) => (
              <div key={i} className="text-green-400 text-sm font-mono">
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
