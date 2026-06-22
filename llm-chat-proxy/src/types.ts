import type { Language } from "@jiki/curriculum";

export interface ChatRequest {
  exerciseSlug: string;
  code: string;
  question: string;
  history?: ChatMessage[];
  nextTaskId?: string;
  language: Language;
  contentHash: string; // Hash for fetching exercise content from app's static files
  // Diff of what the student changed since their previous message, leading into
  // the current code. Same semantics as ChatMessage.codeDiff.
  currentCodeDiff?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  // Unified diff of what the student changed in their code since their previous
  // message. Undefined = no diff to show; "" = code unchanged since previous
  // message; otherwise the diff text (or the too-long sentinel).
  codeDiff?: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining?: number;
  resetAt?: number;
}

export interface Bindings {
  GOOGLE_GEMINI_API_KEY: string;
  DEVISE_JWT_SECRET_KEY: string;
  LLM_SIGNATURE_SECRET: string;
  RATE_LIMITER: RateLimit; // Workers rate-limit binding (see wrangler.toml [[ratelimits]])
  USAGE_KV: KVNamespace; // Per-user daily/monthly message counters (see usage.ts)
}
