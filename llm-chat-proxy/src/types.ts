export interface ChatRequest {
  exerciseSlug: string;
  code: string;
  question: string;
  history?: ChatMessage[];
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
  RAILS_API_URL: string;
  INTERNAL_API_SECRET: string;
}
