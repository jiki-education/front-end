import type { Language } from "@jiki/curriculum";

export interface ChatRequest {
  exerciseSlug: string;
  code: string;
  question: string;
  history?: ChatMessage[];
  nextTaskId?: string;
  language: Language;
  // Exercise content is two artifacts, so it takes two hashes to name it:
  // prose (instructions, per locale) and code (stub/solution, per language).
  proseHash: string;
  codeHash: string;
  locale?: string; // Locale segment of the content path; defaults to "en" for older clients
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
