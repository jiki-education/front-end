export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface SignatureData {
  type: "signature";
  signature: string;
  timestamp: string;
  exerciseSlug: string;
  userMessage: string;
  // Usage meta the proxy attaches to the final signature event. Optional so we
  // stay tolerant of older proxy responses that don't include it.
  messagesToday?: number;
  messagesThisMonth?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
}

// The user's current message usage, as reported by the LLM proxy. Counts are
// UTC-bucketed and include the message that was just served (post-increment).
export interface UsageMeta {
  messagesToday: number;
  messagesThisMonth: number;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface ErrorData {
  type: "error";
  error: string;
  message: string;
}

export type StreamStatus = "idle" | "thinking" | "typing" | "error";

export interface ChatState {
  messages: ChatMessage[];
  currentResponse: string;
  status: StreamStatus;
  error: string | null;
  signature: SignatureData | null;
  chatToken: string | null;
  usage: UsageMeta | null;
}
