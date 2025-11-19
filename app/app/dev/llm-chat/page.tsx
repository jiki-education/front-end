"use client";

import { useAuthStore } from "@/stores/authStore";
import { exercises } from "@jiki/curriculum";
import { getAccessToken } from "@/lib/auth/storage";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  sendChatMessage,
  type ChatRequestPayload,
  type StreamCallbacks
} from "@/components/coding-exercise/lib/chatApi";

// Types
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SignatureData {
  type: "signature";
  signature: string;
  timestamp: string;
  exerciseSlug: string;
  userMessage: string;
}

interface DebugEvent {
  timestamp: string;
  type: "request" | "response" | "error" | "sse";
  data: unknown;
}

type StreamStatus = "idle" | "streaming" | "error";

// Main Component
export default function LLMChatTestPage() {
  const { login, user, isAuthenticated, isLoading: isAuthLoading, error: authError } = useAuthStore();

  // Exercise and code state
  const exerciseSlugs = Object.keys(exercises);
  const [selectedExercise, setSelectedExercise] = useState<string>("basic-movement");
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "python" | "jikiscript">("jikiscript");
  const [code, setCode] = useState<string>("");
  const [isLoadingExercise, setIsLoadingExercise] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Chat state
  const [question, setQuestion] = useState<string>("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [chatError, setChatError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugEvent[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  // Refs
  const responseRef = useRef<HTMLDivElement>(null);

  // Helper function to load exercise code
  const loadExerciseCode = useCallback(
    async (slug: string) => {
      setIsLoadingExercise(true);
      try {
        const loader = exercises[slug as keyof typeof exercises];
        const exercise = (await loader()).default;
        // Get initial code from exercise definition
        const starterCode = exercise.stubs[selectedLanguage] || "// Write your code here";
        setCode(starterCode);

        // Load available tasks
        const tasks = exercise.tasks.map((task) => ({
          id: task.id,
          name: task.name
        }));
        setAvailableTasks(tasks);
        // Auto-select first task
        setSelectedTaskId(tasks.length > 0 ? tasks[0].id : "");
      } catch (err) {
        console.error("Failed to load exercise:", err);
        setCode("// Failed to load exercise code");
        setAvailableTasks([]);
        setSelectedTaskId("");
      } finally {
        setIsLoadingExercise(false);
      }
    },
    [selectedLanguage]
  );

  // Load exercise code when selection changes
  useEffect(() => {
    void loadExerciseCode(selectedExercise);
  }, [selectedExercise, loadExerciseCode]);

  // Auto-scroll response area
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [currentResponse]);

  const handleLogin = async () => {
    try {
      await login({
        email: "ihid@jiki.io",
        password: "password"
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim()) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setChatError("No authentication token found");
      return;
    }

    setStatus("streaming");
    setChatError(null);
    setCurrentResponse("");
    setSignature(null);

    const requestPayload: ChatRequestPayload = {
      exerciseSlug: selectedExercise,
      code,
      question,
      history: history.slice(-5), // Last 5 messages
      nextTaskId: selectedTaskId || undefined, // Only include if set
      language: selectedLanguage
    };

    addDebugEvent("request", requestPayload);

    const callbacks: StreamCallbacks = {
      onTextChunk: (text: string) => {
        setCurrentResponse((prev) => prev + text);
        addDebugEvent("sse", { type: "text_chunk", content: text });
      },
      onSignature: (signatureData: SignatureData) => {
        setSignature(signatureData);
        addDebugEvent("sse", { type: "signature", data: signatureData });
      },
      onError: (error: string) => {
        setChatError(error);
        setStatus("error");
        addDebugEvent("error", { error });
      },
      onComplete: (fullResponse: string, signatureData: SignatureData | null) => {
        // Save conversation to backend if we have both response and signature
        if (fullResponse.trim() && signatureData) {
          void saveConversation(
            selectedExercise,
            question,
            fullResponse.trim(),
            signatureData.timestamp,
            signatureData.signature
          );
        }

        // Add to history
        if (fullResponse.trim()) {
          setHistory((prev) => [
            ...prev,
            { role: "user", content: question },
            { role: "assistant", content: fullResponse.trim() }
          ]);
          setCurrentResponse("");
        }

        setStatus("idle");
        setQuestion("");
      }
    };

    try {
      await sendChatMessage(requestPayload, callbacks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setChatError(errorMessage);
      setStatus("error");
      addDebugEvent("error", { error: errorMessage });
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentResponse("");
    setSignature(null);
    setQuestion("");
    setChatError(null);
    setDebugInfo([]);
    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LLM Chat Proxy Test</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">🔄 Refresh Token Testing</h2>
          <p className="text-blue-800 text-sm">
            This test page now uses the new chat API with automatic refresh token support. To test refresh
            functionality, you can manually expire your token in browser dev tools or wait for natural token expiration.
            The system will automatically refresh and retry failed requests seamlessly.
          </p>
        </div>

        <AuthSection
          isAuthenticated={isAuthenticated}
          user={user}
          isAuthLoading={isAuthLoading}
          authError={authError}
          onLogin={handleLogin}
        />

        {isAuthenticated && (
          <div className="grid grid-cols-5 gap-6 mt-6">
            <div className="col-span-2 space-y-4">
              <ExerciseSelector
                exerciseSlugs={exerciseSlugs}
                selectedExercise={selectedExercise}
                onSelectExercise={setSelectedExercise}
                isLoading={isLoadingExercise}
              />

              <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />

              <TaskSelector
                availableTasks={availableTasks}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
              />

              <CodeEditor code={code} onChange={setCode} />

              <QuestionInput
                question={question}
                onChange={setQuestion}
                onSubmit={handleSendQuestion}
                disabled={status === "streaming"}
              />

              <ConversationHistory history={history} />

              <ActionButtons
                onSend={handleSendQuestion}
                onClear={handleClearHistory}
                disabled={status === "streaming" || !question.trim()}
              />
            </div>

            <div className="col-span-3 space-y-4">
              <StatusIndicator status={status} />

              <ResponseDisplay currentResponse={currentResponse} responseRef={responseRef} />

              {signature && <SignatureDisplay signature={signature} />}

              {chatError && <ErrorDisplay error={chatError} />}

              <DebugPanel debugInfo={debugInfo} showDebug={showDebug} onToggle={() => setShowDebug(!showDebug)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper functions

  async function saveConversation(
    exerciseSlug: string,
    userMessage: string,
    assistantMessage: string,
    timestamp: string,
    signatureValue: string
  ) {
    const token = getAccessToken();
    if (!token) {
      console.error("No token available to save conversation");
      return;
    }

    try {
      // Estimate tokens (rough approximation: 4 chars ≈ 1 token)
      const userMessageTokens = Math.ceil(userMessage.length / 4);
      const assistantMessageTokens = Math.ceil(assistantMessage.length / 4);

      // Save user message
      const userPayload = {
        context_type: "lesson",
        context_identifier: exerciseSlug,
        content: userMessage,
        tokens: userMessageTokens
      };

      addDebugEvent("request", { endpoint: "/internal/assistant_conversations/user_messages", payload: userPayload });

      const userResponse = await fetch("http://localhost:3060/internal/assistant_conversations/user_messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userPayload)
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to save user message: ${userResponse.status} ${userResponse.statusText}`);
      }

      const userResult = await userResponse.json();
      addDebugEvent("response", { endpoint: "/internal/assistant_conversations/user_messages", result: userResult });

      // Save assistant message with signature
      const assistantPayload = {
        context_type: "lesson",
        context_identifier: exerciseSlug,
        content: assistantMessage,
        tokens: assistantMessageTokens,
        timestamp: timestamp,
        signature: signatureValue
      };

      addDebugEvent("request", {
        endpoint: "/internal/assistant_conversations/assistant_messages",
        payload: assistantPayload
      });

      const assistantResponse = await fetch(
        "http://localhost:3060/internal/assistant_conversations/assistant_messages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(assistantPayload)
        }
      );

      if (!assistantResponse.ok) {
        throw new Error(
          `Failed to save assistant message: ${assistantResponse.status} ${assistantResponse.statusText}`
        );
      }

      const assistantResult = await assistantResponse.json();
      addDebugEvent("response", {
        endpoint: "/internal/assistant_conversations/assistant_messages",
        result: assistantResult
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to save conversation:", errorMessage);
      addDebugEvent("error", { endpoint: "assistant_conversations", error: errorMessage });
      // Don't throw - we don't want to break the UI if save fails
    }
  }

  function addDebugEvent(type: DebugEvent["type"], data: unknown) {
    setDebugInfo((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        type,
        data
      }
    ]);
  }
}

// Sub-components
function AuthSection({
  isAuthenticated,
  user,
  isAuthLoading,
  authError,
  onLogin
}: {
  isAuthenticated: boolean;
  user: { email: string } | null;
  isAuthLoading: boolean;
  authError: string | null;
  onLogin: () => void;
}) {
  if (isAuthenticated && user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">
          <strong>✅ Logged in as:</strong> {user.email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-3 text-yellow-900">Authentication Required</h2>
      <p className="text-yellow-800 mb-4">You need to be logged in to test the LLM Chat Proxy.</p>
      {authError && (
        <p className="text-red-600 mb-4">
          <strong>Error:</strong> {authError}
        </p>
      )}
      <button
        onClick={onLogin}
        disabled={isAuthLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAuthLoading ? "Logging in..." : "Login as ihid@jiki.io"}
      </button>
    </div>
  );
}

function LanguageSelector({
  selectedLanguage,
  onSelectLanguage
}: {
  selectedLanguage: "javascript" | "python" | "jikiscript";
  onSelectLanguage: (language: "javascript" | "python" | "jikiscript") => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-semibold mb-2">Language</label>
      <select
        value={selectedLanguage}
        onChange={(e) => onSelectLanguage(e.target.value as "javascript" | "python" | "jikiscript")}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="jikiscript">JikiScript</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>
    </div>
  );
}

function TaskSelector({
  availableTasks,
  selectedTaskId,
  onSelectTask
}: {
  availableTasks: Array<{ id: string; name: string }>;
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-semibold mb-2">Current Task (for LLM context)</label>
      <select
        value={selectedTaskId}
        onChange={(e) => onSelectTask(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No specific task (exercise-level guidance only)</option>
        {availableTasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ExerciseSelector({
  exerciseSlugs,
  selectedExercise,
  onSelectExercise,
  isLoading
}: {
  exerciseSlugs: string[];
  selectedExercise: string;
  onSelectExercise: (slug: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-semibold mb-2">Exercise</label>
      <select
        value={selectedExercise}
        onChange={(e) => onSelectExercise(e.target.value)}
        disabled={isLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {exerciseSlugs.map((slug) => (
          <option key={slug} value={slug}>
            {slug}
          </option>
        ))}
      </select>
    </div>
  );
}

function CodeEditor({ code, onChange }: { code: string; onChange: (code: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-semibold mb-2">Code</label>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 px-3 py-2 font-mono text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your code here..."
      />
    </div>
  );
}

function QuestionInput({
  question,
  onChange,
  onSubmit,
  disabled
}: {
  question: string;
  onChange: (question: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-semibold mb-2">Question</label>
      <input
        type="text"
        value={question}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            onSubmit();
          }
        }}
        placeholder="Ask a question about your code..."
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function ConversationHistory({ history }: { history: ChatMessage[] }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold mb-2">Conversation History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.slice(-5).map((msg, idx) => (
          <div key={idx} className="text-sm">
            <div className="font-semibold mb-1">{msg.role === "user" ? "You:" : "Assistant:"}</div>
            <div className="text-gray-700 whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButtons({ onSend, onClear, disabled }: { onSend: () => void; onClear: () => void; disabled: boolean }) {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onSend}
        disabled={disabled}
        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send Question
      </button>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Clear History
      </button>
    </div>
  );
}

function StatusIndicator({ status }: { status: StreamStatus }) {
  const colors = {
    idle: "bg-gray-100 text-gray-800 border-gray-300",
    streaming: "bg-blue-100 text-blue-800 border-blue-300",
    error: "bg-red-100 text-red-800 border-red-300"
  };

  const labels = {
    idle: "Idle",
    streaming: "Streaming...",
    error: "Error"
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border ${colors[status]}`}>
      <span className="text-sm font-semibold">{labels[status]}</span>
    </div>
  );
}

function ResponseDisplay({
  currentResponse,
  responseRef
}: {
  currentResponse: string;
  responseRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold mb-2">Current Response</h3>
      <div
        ref={responseRef}
        className="h-96 overflow-y-auto p-3 bg-gray-50 rounded border border-gray-200 font-mono text-sm whitespace-pre-wrap"
      >
        {currentResponse || <span className="text-gray-400">Response will appear here...</span>}
      </div>
    </div>
  );
}

function SignatureDisplay({ signature }: { signature: SignatureData }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2 text-green-900">✅ Signature Received</h3>
      <div className="space-y-1 text-sm font-mono">
        <div>
          <span className="font-semibold">Signature:</span> {signature.signature.substring(0, 40)}...
        </div>
        <div>
          <span className="font-semibold">Timestamp:</span> {signature.timestamp}
        </div>
        <div>
          <span className="font-semibold">Exercise:</span> {signature.exerciseSlug}
        </div>
        <div>
          <span className="font-semibold">Question:</span> {signature.userMessage.substring(0, 50)}
          {signature.userMessage.length > 50 ? "..." : ""}
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2 text-red-900">❌ Error</h3>
      <p className="text-sm text-red-800">{error}</p>
    </div>
  );
}

function DebugPanel({
  debugInfo,
  showDebug,
  onToggle
}: {
  debugInfo: DebugEvent[];
  showDebug: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <button onClick={onToggle} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
        {showDebug ? "▼ Hide" : "▶ Show"} Debug Info ({debugInfo.length} events)
      </button>

      {showDebug && (
        <div className="mt-3 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {debugInfo.map((event, idx) => (
              <div key={idx} className="bg-gray-50 rounded p-3 text-xs font-mono">
                <div className="font-semibold mb-1">
                  [{event.timestamp}] {event.type.toUpperCase()}
                </div>
                <pre className="whitespace-pre-wrap overflow-x-auto">{JSON.stringify(event.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
