// Max characters for a single outgoing chat message (the user's question and
// each history entry). Mirrors the proxy's QUESTION_MAX_LENGTH. Enforced in the
// composer UI AND again at the API boundary, so tampering with the textarea's
// maxLength in DevTools can't push an oversized payload over the wire.
export const MAX_CHAT_MESSAGE_LENGTH = 1000;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  // Unified diff of what the student changed in their code since their previous
  // message, attached at send time (see codeDiff.ts). Carried to the proxy so it
  // can interleave progress into the conversation history. Undefined = no diff to
  // show (no snapshot / base of run); "" = code unchanged since previous message.
  codeDiff?: string;
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
