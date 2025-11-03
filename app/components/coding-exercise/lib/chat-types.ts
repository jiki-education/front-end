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
}

export interface ErrorData {
  type: "error";
  error: string;
  message: string;
}

export type StreamStatus = "idle" | "streaming" | "error";

export interface ChatState {
  messages: ChatMessage[];
  currentResponse: string;
  status: StreamStatus;
  error: string | null;
  signature: SignatureData | null;
}
