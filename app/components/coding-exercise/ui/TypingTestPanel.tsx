"use client";

import { useState, useCallback } from "react";
import TypeItAssistantMessage from "./TypeItAssistantMessage";
import type { StreamStatus } from "../lib/chat-types";

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
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Typing Effect Test Panel</h2>
          <p className="text-sm text-gray-600 mt-1">Test the typing mechanism without expensive API calls</p>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={simulateThinking}
              disabled={status !== "idle"}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              1. Start Thinking
            </button>

            <button
              onClick={simulateTyping}
              disabled={status !== "thinking"}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              2. Start Typing
            </button>

            <button
              onClick={simulateInstantText}
              disabled={status !== "idle"}
              className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Instant
            </button>

            <button onClick={reset} className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Typing Speed:</label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={typingSpeed}
              onChange={(e) => setTypingSpeed(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{typingSpeed}ms per character</span>
          </div>
        </div>

        {/* Status Display */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                status === "idle"
                  ? "bg-gray-100 text-gray-800"
                  : status === "thinking"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "typing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {status.toUpperCase()}
            </span>
            <span className="text-gray-600">Content Length: {currentResponse.length}</span>
          </div>
        </div>
      </div>

      {/* Message Display Area */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 min-h-[200px]">
        <h3 className="text-md font-medium text-gray-900 mb-4">Message Display:</h3>

        {(currentResponse || status === "thinking") && (
          <TypeItAssistantMessage
            content={currentResponse}
            status={status}
            typingSpeed={typingSpeed}
            onTypingComplete={() => setStatus("idle")}
          />
        )}

        {!currentResponse && status === "idle" && (
          <div className="text-center text-gray-500 text-sm py-8">
            No message to display. Click &quot;Start Thinking&ldquo; to begin test.
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-medium text-gray-900 mb-2">Debug Info:</h3>
        <div className="text-xs font-mono text-gray-600 space-y-1">
          <div>Status: {status}</div>
          <div>Content: &quot;{currentResponse}&quot;</div>
          <div>Content Length: {currentResponse.length} chars</div>
          <div>Should Type: {currentResponse && status === "typing" ? "YES" : "NO"}</div>
        </div>
      </div>
    </div>
  );
}
