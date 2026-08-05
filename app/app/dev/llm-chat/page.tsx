"use client";

import {
  sendChatMessage,
  ChatTokenExpiredError,
  type ChatRequestPayload,
  type StreamCallbacks
} from "@/components/coding-exercise/lib/chatApi";
import { fetchChatToken } from "@/components/coding-exercise/lib/chatTokenApi";
import { useAuthStore } from "@/lib/auth/authStore";
import { exercises, type ExerciseLessonSlug } from "@jiki/curriculum";
import { fetchExerciseContent } from "@/lib/api/exercise-meta";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

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
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLessonSlug>("maze-solve-basic");
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "python" | "jikiscript">("jikiscript");
  const [code, setCode] = useState<string>("");
  const [contentHash, setContentHash] = useState<string>("");
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
  const [chatToken, setChatToken] = useState<string | null>(null);

  // Refs
  const responseRef = useRef<HTMLDivElement>(null);

  // Helper function to load exercise code
  const loadExerciseCode = useCallback(
    async (slug: string) => {
      setIsLoadingExercise(true);
      try {
        const loader = exercises[slug as keyof typeof exercises];
        const exercise = (await loader()).default;

        // Load stub from static content
        const content = await fetchExerciseContent(slug, "en", selectedLanguage);
        const starterCode = content.stub || "// Write your code here";
        setCode(starterCode);
        setContentHash(content.contentHash);

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
        setContentHash("");
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

  // Clear cached token when exercise changes (token is exercise-scoped)
  useEffect(() => {
    setChatToken(null);
  }, [selectedExercise]);

  // Auto-scroll response area
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [currentResponse]);

  const handleLogin = async () => {
    try {
      await login(
        {
          email: "ihid@jiki.io",
          password: "password"
        },
        "dev-stub-token"
      );
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim()) {
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
      language: selectedLanguage,
      locale: "en",
      contentHash
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

    // Helper to make the actual request
    const performRequest = async (token: string) => {
      await sendChatMessage(requestPayload, callbacks, token);
    };

    try {
      // Get or reuse chat token
      let token = chatToken;
      if (!token) {
        addDebugEvent("request", { type: "fetch_token", lessonSlug: selectedExercise });
        token = await fetchChatToken({
          context: { type: "lesson", slug: selectedExercise },
          cfTurnstileResponse: "dev-stub-token"
        });
        setChatToken(token);
        addDebugEvent("response", { type: "token_received" });
      }

      try {
        await performRequest(token);
      } catch (err) {
        // If token expired, clear it, get new one, and retry
        if (err instanceof ChatTokenExpiredError) {
          addDebugEvent("sse", { type: "token_expired", retrying: true });
          setChatToken(null);
          const newToken = await fetchChatToken({
            context: { type: "lesson", slug: selectedExercise },
            cfTurnstileResponse: "dev-stub-token"
          });
          setChatToken(newToken);
          await performRequest(newToken);
        } else {
          throw err;
        }
      }
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
    setChatToken(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>LLM Chat Proxy Test</h1>

        <div className={styles.infoBanner}>
          <h2 className={styles.infoBannerTitle}>🔄 Refresh Token Testing</h2>
          <p className={styles.infoBannerText}>
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
          <div className={styles.layout}>
            <div className={styles.colLeft}>
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

            <div className={styles.colRight}>
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
          "Content-Type": "application/json"
        },
        credentials: "include", // Send cookies
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
            "Content-Type": "application/json"
          },
          credentials: "include", // Send cookies
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
      <div className={styles.authSuccess}>
        <p className={styles.authSuccessText}>
          <strong>✅ Logged in as:</strong> {user.email}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.authPrompt}>
      <h2 className={styles.authPromptTitle}>Authentication Required</h2>
      <p className={styles.authPromptText}>You need to be logged in to test the LLM Chat Proxy.</p>
      {authError && (
        <p className={styles.authError}>
          <strong>Error:</strong> {authError}
        </p>
      )}
      <button onClick={onLogin} disabled={isAuthLoading} className={styles.buttonLogin}>
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
    <div className={styles.panel}>
      <label className={styles.fieldLabel}>Language</label>
      <select
        value={selectedLanguage}
        onChange={(e) => onSelectLanguage(e.target.value as "javascript" | "python" | "jikiscript")}
        className={styles.select}
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
    <div className={styles.panel}>
      <label className={styles.fieldLabel}>Current Task (for LLM context)</label>
      <select value={selectedTaskId} onChange={(e) => onSelectTask(e.target.value)} className={styles.select}>
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
  onSelectExercise: (slug: ExerciseLessonSlug) => void;
  isLoading: boolean;
}) {
  return (
    <div className={styles.panel}>
      <label className={styles.fieldLabel}>Exercise</label>
      <select
        value={selectedExercise}
        onChange={(e) => onSelectExercise(e.target.value as ExerciseLessonSlug)}
        disabled={isLoading}
        className={styles.select}
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
    <div className={styles.panel}>
      <label className={styles.fieldLabel}>Code</label>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className={styles.textarea}
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
    <div className={styles.panel}>
      <label className={styles.fieldLabel}>Question</label>
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
        className={styles.input}
      />
    </div>
  );
}

function ConversationHistory({ history }: { history: ChatMessage[] }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.historyTitle}>Conversation History</h3>
      <div className={styles.historyList}>
        {history.slice(-5).map((msg, idx) => (
          <div key={idx} className={styles.historyItem}>
            <div className={styles.historyRole}>{msg.role === "user" ? "You:" : "Assistant:"}</div>
            <div className={styles.historyContent}>{msg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButtons({ onSend, onClear, disabled }: { onSend: () => void; onClear: () => void; disabled: boolean }) {
  return (
    <div className={styles.actionRow}>
      <button onClick={onSend} disabled={disabled} className={styles.buttonSend}>
        Send Question
      </button>
      <button onClick={onClear} className={styles.buttonClear}>
        Clear History
      </button>
    </div>
  );
}

function StatusIndicator({ status }: { status: StreamStatus }) {
  const labels = {
    idle: "Idle",
    streaming: "Streaming...",
    error: "Error"
  };

  return (
    <div className={styles.statusIndicator} data-status={status}>
      <span className={styles.statusLabel}>{labels[status]}</span>
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
    <div className={styles.panel}>
      <h3 className={styles.responseTitle}>Current Response</h3>
      <div ref={responseRef} className={styles.responseBox}>
        {currentResponse || <span className={styles.responsePlaceholder}>Response will appear here...</span>}
      </div>
    </div>
  );
}

function SignatureDisplay({ signature }: { signature: SignatureData }) {
  return (
    <div className={styles.signatureBox}>
      <h3 className={styles.signatureTitle}>✅ Signature Received</h3>
      <div className={styles.signatureList}>
        <div>
          <span className={styles.signatureKey}>Signature:</span> {signature.signature.substring(0, 40)}...
        </div>
        <div>
          <span className={styles.signatureKey}>Timestamp:</span> {signature.timestamp}
        </div>
        <div>
          <span className={styles.signatureKey}>Exercise:</span> {signature.exerciseSlug}
        </div>
        <div>
          <span className={styles.signatureKey}>Question:</span> {signature.userMessage.substring(0, 50)}
          {signature.userMessage.length > 50 ? "..." : ""}
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className={styles.errorBox}>
      <h3 className={styles.errorTitle}>❌ Error</h3>
      <p className={styles.errorText}>{error}</p>
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
    <div className={styles.panel}>
      <button onClick={onToggle} className={styles.debugToggle}>
        {showDebug ? "▼ Hide" : "▶ Show"} Debug Info ({debugInfo.length} events)
      </button>

      {showDebug && (
        <div className={styles.debugList}>
          <div className={styles.debugEvents}>
            {debugInfo.map((event, idx) => (
              <div key={idx} className={styles.debugEvent}>
                <div className={styles.debugEventHeader}>
                  [{event.timestamp}] {event.type.toUpperCase()}
                </div>
                <pre className={styles.debugEventData}>{JSON.stringify(event.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
