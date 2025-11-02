"use client";

import { useAuthStore } from "@/stores/authStore";
import { exercises } from "@jiki/curriculum";
import { getToken } from "@/lib/auth/storage";
import { useState, useEffect, useRef } from "react";

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

interface ErrorData {
  type: "error";
  error: string;
  message: string;
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
  const [code, setCode] = useState<string>("");
  const [isLoadingExercise, setIsLoadingExercise] = useState(false);

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

  // Load exercise code when selection changes
  useEffect(() => {
    void loadExerciseCode(selectedExercise);
  }, [selectedExercise]);

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

    const token = getToken();
    if (!token) {
      setChatError("No authentication token found");
      return;
    }

    setStatus("streaming");
    setChatError(null);
    setCurrentResponse("");
    setSignature(null);

    const requestPayload = {
      exerciseSlug: selectedExercise,
      code,
      question,
      history: history.slice(-5) // Last 5 messages
    };

    addDebugEvent("request", requestPayload);

    try {
      const response = await fetch("http://localhost:3063/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Handle streaming response
      await handleStreamingResponse(response.body, question);
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
  async function loadExerciseCode(slug: string) {
    setIsLoadingExercise(true);
    try {
      const loader = exercises[slug as keyof typeof exercises];
      const exercise = (await loader()).default;
      // Get initial code from exercise definition
      const starterCode = exercise.initialCode || "// Write your code here";
      setCode(starterCode);
    } catch (err) {
      console.error("Failed to load exercise:", err);
      setCode("// Failed to load exercise code");
    } finally {
      setIsLoadingExercise(false);
    }
  }

  async function handleStreamingResponse(body: ReadableStream<Uint8Array>, userQuestion: string) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let buffer = "";
    let receivedSignature: SignatureData | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Check for "data: " markers in the buffer
        let dataIndex = buffer.indexOf("data: ");

        while (dataIndex !== -1) {
          // If there's text before "data: ", it's part of the response
          if (dataIndex > 0) {
            const textBeforeData = buffer.substring(0, dataIndex);
            accumulatedText += textBeforeData;
            setCurrentResponse(accumulatedText);
          }

          // Find the end of this data line (look for next newline)
          const endOfLine = buffer.indexOf("\n", dataIndex);
          if (endOfLine === -1) {
            // Incomplete data line, keep in buffer
            buffer = buffer.substring(dataIndex);
            break;
          }

          // Extract the data line
          const dataLine = buffer.substring(dataIndex + 6, endOfLine); // +6 to skip "data: "

          // Try to parse as JSON
          try {
            const data = JSON.parse(dataLine);
            addDebugEvent("sse", data);

            if (data.type === "signature") {
              receivedSignature = data as SignatureData;
              setSignature(receivedSignature);
            } else if (data.type === "error") {
              const errorData = data as ErrorData;
              setChatError(errorData.message);
              setStatus("error");
            }
          } catch {
            // Not valid JSON, might be malformed
            console.error("Failed to parse SSE data:", dataLine);
          }

          // Move past this data line
          buffer = buffer.substring(endOfLine + 1);
          dataIndex = buffer.indexOf("data: ");
        }

        // Any remaining buffer is text
        if (buffer && !buffer.startsWith("data: ")) {
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            accumulatedText += line + "\n";
            setCurrentResponse(accumulatedText);
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        accumulatedText += buffer;
        setCurrentResponse(accumulatedText);
      }

      // Save conversation to backend if we have both response and signature
      if (accumulatedText.trim() && receivedSignature) {
        await saveConversation(
          selectedExercise,
          userQuestion,
          accumulatedText.trim(),
          receivedSignature.timestamp,
          receivedSignature.signature
        );
      }

      // Add to history
      if (accumulatedText.trim()) {
        setHistory((prev) => [
          ...prev,
          { role: "user", content: userQuestion },
          { role: "assistant", content: accumulatedText.trim() }
        ]);
        setCurrentResponse("");
      }

      setStatus("idle");
      setQuestion("");
    } catch (err) {
      throw err;
    }
  }

  async function saveConversation(
    exerciseSlug: string,
    userMessage: string,
    assistantMessage: string,
    timestamp: string,
    signatureValue: string
  ) {
    const token = getToken();
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
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history.slice(-5).map((msg, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-semibold">{msg.role === "user" ? "You: " : "Assistant: "}</span>
            <span className="text-gray-700">
              {msg.content.substring(0, 100)}
              {msg.content.length > 100 ? "..." : ""}
            </span>
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
