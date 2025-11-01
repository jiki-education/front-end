# LLM Chat Feature - Implementation Plan

## Overview

This plan outlines the implementation of an LLM-powered chat feature for coding exercises, allowing students to ask questions about their code and receive contextual help.

### Key Architectural Decisions

**1. Use Gemini 2.5 Flash-Lite**
- **Cost:** $0.0004 per message vs $0.00185 for Flash (78% savings)
- **Volume:** 50K messages/day = $600/month vs $2,775/month
- **Quality:** Sufficient for student help with coding exercises
- Input: $0.10/1M tokens, Output: $0.40/1M tokens

**2. LLM Chat Proxy Package (TypeScript, Cloudflare Workers)**
- Lives in this monorepo as `llm-chat-proxy/` package
- Separate from existing `../../llm-proxy` (which is async/fire-and-forget for translations)
- Synchronous streaming responses (not callbacks)
- JWT validation on edge (no Rails call needed)
- Deployed globally on Cloudflare Workers

**3. Bundle Curriculum Package**
- Import `@jiki/curriculum` directly in the proxy
- Zero latency access to exercise context
- Type-safe integration
- No API calls needed
- Bundle size: ~200-250KB compressed (well within 1MB free tier limit)
- Workers stay warm 99.99% of time with traffic volume, so data is in memory

**4. Response Flow**
```
Client → LLM Chat Proxy (validates JWT, builds prompt with curriculum data, streams from Gemini) → Client
                ↓ (async, after streaming)
            Rails API (saves conversation)
```

**5. Fast Response Time**
- JWT validation: <1ms (local verification on edge)
- Exercise context lookup: <0.001ms (in-memory)
- Gemini streaming: ~1 second
- No blocking calls to Rails for validation
- Total response time: ~1 second

---

## Monorepo Package Structure

Add `llm-chat-proxy/` as a new package in the monorepo:

```
front-end/
├── app/                    # Next.js frontend
├── content/                # Blog posts and articles
├── curriculum/             # Exercise content library
├── interpreters/           # Language interpreters
├── llm-chat-proxy/        # NEW: LLM chat proxy service
│   ├── src/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── gemini.ts
│   │   ├── prompt-builder.ts
│   │   ├── rate-limiter.ts
│   │   ├── rails-client.ts
│   │   └── types.ts
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── gemini.test.ts
│   │   ├── prompt-builder.test.ts
│   │   └── integration.test.ts
│   ├── .dev.vars.example
│   ├── wrangler.toml
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── README.md
└── package.json            # Root workspace config
```

### Update Root Package.json

```json
{
  "name": "jiki-frontend",
  "private": true,
  "workspaces": [
    "app",
    "content",
    "curriculum",
    "interpreters",
    "llm-chat-proxy"
  ]
}
```

---

## Creating the llm-chat-proxy Package

### 1. Initialize Package

```bash
cd front-end
mkdir llm-chat-proxy
cd llm-chat-proxy

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@jiki/llm-chat-proxy",
  "version": "1.0.0",
  "description": "LLM chat proxy for coding exercise help",
  "type": "module",
  "main": "src/index.ts",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.23.0",
    "@jiki/curriculum": "workspace:*",
    "hono": "^4.9.10",
    "jose": "^5.2.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250109.0",
    "@types/node": "^24.7.1",
    "typescript": "^5.9.3",
    "vitest": "^3.2.4",
    "wrangler": "^3.93.0"
  }
}
EOF

# Install dependencies
pnpm install
```

### 2. Configure TypeScript

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "outDir": "./dist",
    "paths": {
      "@jiki/curriculum": ["../curriculum/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 3. Configure Cloudflare Workers

```toml
# wrangler.toml
name = "llm-chat-proxy"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "llm-chat-proxy"
workers_dev = false
route = "https://llm.jiki.app/*"

# Environment variables (set via: wrangler secret put <NAME>)
# - GOOGLE_GEMINI_API_KEY
# - DEVISE_JWT_SECRET_KEY
# - RAILS_API_URL
# - INTERNAL_API_SECRET

# For local development, create .dev.vars with these values
```

```bash
# .dev.vars.example
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
DEVISE_JWT_SECRET_KEY=your_devise_jwt_secret_from_rails
RAILS_API_URL=http://localhost:3061
INTERNAL_API_SECRET=shared_secret_with_rails
```

### 4. Configure Testing

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  },
  resolve: {
    alias: {
      '@jiki/curriculum': path.resolve(__dirname, '../curriculum/src')
    }
  }
});
```

---

## Core Implementation

### 1. Main Entry Point (`src/index.ts`)

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { verifyJWT } from './auth';
import { streamGeminiResponse } from './gemini';
import { buildPrompt } from './prompt-builder';
import { checkRateLimit } from './rate-limiter';
import { saveConversationToRails } from './rails-client';

type Bindings = {
  GOOGLE_GEMINI_API_KEY: string;
  DEVISE_JWT_SECRET_KEY: string;
  RAILS_API_URL: string;
  INTERNAL_API_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS for frontend
app.use('/chat', cors({
  origin: (origin) => {
    // Allow localhost and production domains
    if (
      origin.includes('localhost') ||
      origin.includes('jiki.app')
    ) {
      return origin;
    }
    return null;
  },
  credentials: true
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'llm-chat-proxy' });
});

// Main chat endpoint
app.post('/chat', async (c) => {
  try {
    // 1. Extract and verify JWT
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return c.json({ error: 'Missing authorization token' }, 401);
    }

    const userId = await verifyJWT(token, c.env.DEVISE_JWT_SECRET_KEY);
    if (!userId) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    // 2. Check rate limit
    const isAllowed = await checkRateLimit(userId, c.env);
    if (!isAllowed) {
      return c.json({
        error: 'Rate limit exceeded. Maximum 50 messages per hour.'
      }, 429);
    }

    // 3. Parse request
    const body = await c.req.json<{
      exerciseSlug: string;
      code: string;
      question: string;
      history?: Array<{ role: string; content: string }>;
    }>();

    const { exerciseSlug, code, question, history = [] } = body;

    if (!exerciseSlug || !code || !question) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // 4. Build prompt (uses curriculum package)
    const prompt = buildPrompt({
      exerciseSlug,
      code,
      question,
      history
    });

    // 5. Stream from Gemini
    let fullResponse = '';
    const stream = await streamGeminiResponse(
      prompt,
      c.env.GOOGLE_GEMINI_API_KEY,
      (chunk) => {
        fullResponse += chunk;
      }
    );

    // 6. Save conversation to Rails after stream completes (don't await)
    // The stream will be closed by then, so we have the full response
    c.executionCtx.waitUntil(
      saveConversationToRails({
        userId,
        exerciseSlug,
        userMessage: question,
        assistantMessage: fullResponse,
        railsApiUrl: c.env.RAILS_API_URL,
        internalSecret: c.env.INTERNAL_API_SECRET
      })
    );

    // 7. Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return c.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
```

### 2. JWT Authentication (`src/auth.ts`)

```typescript
import { jwtVerify } from 'jose';

export async function verifyJWT(
  token: string,
  secret: string
): Promise<string | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256']
    });

    // Check expiration (devise-jwt includes exp claim)
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('Token expired');
      return null;
    }

    // User ID is in the 'sub' claim
    return payload.sub as string;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
```

### 3. Gemini Integration (`src/gemini.ts`)

```typescript
import { GoogleGenAI } from '@google/genai';

export async function streamGeminiResponse(
  prompt: string,
  apiKey: string,
  onChunk?: (chunk: string) => void
): Promise<ReadableStream> {
  const ai = new GoogleGenAI({ apiKey });

  const geminiStream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048
    }
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const text = chunk.text || '';

          // Call callback if provided (for collecting full response)
          if (onChunk) {
            onChunk(text);
          }

          // Send to client
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        console.error('Gemini streaming error:', error);
        controller.error(error);
      }
    }
  });
}
```

### 4. Prompt Builder (`src/prompt-builder.ts`)

```typescript
import { getExercise } from '@jiki/curriculum';

interface PromptOptions {
  exerciseSlug: string;
  code: string;
  question: string;
  history: Array<{ role: string; content: string }>;
}

export function buildPrompt(options: PromptOptions): string {
  const { exerciseSlug, code, question, history } = options;

  // Get exercise context from bundled curriculum
  const exercise = getExercise(exerciseSlug);

  if (!exercise) {
    throw new Error(`Exercise not found: ${exerciseSlug}`);
  }

  // Build exercise context
  const exerciseContext = buildExerciseContext(exercise);

  // Build conversation history (last 5 messages only to manage token count)
  const conversationHistory = history
    .slice(-5)
    .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
    .join('\n\n');

  return `You are a helpful coding tutor assisting a student with a programming exercise.

EXERCISE: ${exercise.title}
${exerciseContext}

CURRENT CODE:
\`\`\`javascript
${code}
\`\`\`

${conversationHistory ? `CONVERSATION HISTORY:\n${conversationHistory}\n\n` : ''}

STUDENT QUESTION:
${question}

INSTRUCTIONS:
- Provide a helpful, educational response that guides the student
- Don't give away the complete solution
- Focus on teaching concepts and debugging strategies
- Ask guiding questions when appropriate
- Reference the specific parts of their code that need attention
- Keep responses concise and focused (2-3 paragraphs maximum)

Response:`;
}

function buildExerciseContext(exercise: any): string {
  const parts: string[] = [];

  if (exercise.description) {
    parts.push(`DESCRIPTION: ${exercise.description}`);
  }

  if (exercise.learningObjectives?.length) {
    parts.push(`LEARNING OBJECTIVES:\n${exercise.learningObjectives.map((obj: string) => `- ${obj}`).join('\n')}`);
  }

  if (exercise.hints?.length) {
    parts.push(`HINTS AVAILABLE:\n${exercise.hints.map((hint: string) => `- ${hint}`).join('\n')}`);
  }

  if (exercise.commonMistakes?.length) {
    parts.push(`COMMON MISTAKES TO WATCH FOR:\n${exercise.commonMistakes.map((mistake: string) => `- ${mistake}`).join('\n')}`);
  }

  return parts.join('\n\n');
}
```

### 5. Rate Limiter (`src/rate-limiter.ts`)

```typescript
// Simple in-memory rate limiter for MVP
// TODO: Use Cloudflare KV or Durable Objects for production multi-region deployment

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT = 50; // messages per hour
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function checkRateLimit(
  userId: string,
  env: any
): Promise<boolean> {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries(now);
  }

  if (!userLimit || userLimit.resetAt < now) {
    // First request or window expired - create new entry
    rateLimitStore.set(userId, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

function cleanupExpiredEntries(now: number): void {
  const toDelete: string[] = [];

  for (const [userId, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      toDelete.push(userId);
    }
  }

  toDelete.forEach(userId => rateLimitStore.delete(userId));
}
```

### 6. Rails Client (`src/rails-client.ts`)

```typescript
interface SaveConversationOptions {
  userId: string;
  exerciseSlug: string;
  userMessage: string;
  assistantMessage: string;
  railsApiUrl: string;
  internalSecret: string;
}

export async function saveConversationToRails(
  options: SaveConversationOptions
): Promise<void> {
  const {
    userId,
    exerciseSlug,
    userMessage,
    assistantMessage,
    railsApiUrl,
    internalSecret
  } = options;

  try {
    const response = await fetch(`${railsApiUrl}/api/internal/llm/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': internalSecret
      },
      body: JSON.stringify({
        user_id: userId,
        exercise_slug: exerciseSlug,
        messages: [
          {
            role: 'user',
            content: userMessage,
            tokens: estimateTokens(userMessage)
          },
          {
            role: 'assistant',
            content: assistantMessage,
            tokens: estimateTokens(assistantMessage)
          }
        ],
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('Failed to save conversation:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error saving conversation to Rails:', error);
    // Don't throw - we don't want to fail the user request if DB save fails
  }
}

// Rough token estimation (4 chars ≈ 1 token)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
```

### 7. TypeScript Types (`src/types.ts`)

```typescript
export interface ChatRequest {
  exerciseSlug: string;
  code: string;
  question: string;
  history?: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining?: number;
  resetAt?: number;
}

export interface ExerciseContext {
  slug: string;
  title: string;
  description?: string;
  learningObjectives?: string[];
  hints?: string[];
  commonMistakes?: string[];
}
```

---

## Testing

### 1. JWT Authentication Tests (`tests/auth.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { verifyJWT } from '../src/auth';
import { SignJWT } from 'jose';

describe('JWT Authentication', () => {
  const testSecret = 'test-secret-key-for-jwt-verification';

  it('should verify valid JWT', async () => {
    // Create a valid test JWT
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: 'user-123' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBe('user-123');
  });

  it('should reject invalid JWT', async () => {
    const token = 'invalid.jwt.token';
    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });

  it('should reject expired JWT', async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: 'user-123' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('-1h') // Expired 1 hour ago
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });

  it('should reject JWT with wrong secret', async () => {
    const secret = new TextEncoder().encode('wrong-secret');
    const token = await new SignJWT({ sub: 'user-123' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });
});
```

### 2. Prompt Builder Tests (`tests/prompt-builder.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { buildPrompt } from '../src/prompt-builder';

describe('Prompt Builder', () => {
  it('should build prompt with exercise context', () => {
    const prompt = buildPrompt({
      exerciseSlug: 'hello-world',
      code: 'console.log("hello");',
      question: 'How do I fix this?',
      history: []
    });

    expect(prompt).toContain('hello-world');
    expect(prompt).toContain('console.log("hello")');
    expect(prompt).toContain('How do I fix this?');
    expect(prompt).toContain('EXERCISE:');
    expect(prompt).toContain('CURRENT CODE:');
  });

  it('should include conversation history', () => {
    const prompt = buildPrompt({
      exerciseSlug: 'hello-world',
      code: 'console.log("hello");',
      question: 'What about this?',
      history: [
        { role: 'user', content: 'Previous question' },
        { role: 'assistant', content: 'Previous answer' }
      ]
    });

    expect(prompt).toContain('Previous question');
    expect(prompt).toContain('Previous answer');
    expect(prompt).toContain('CONVERSATION HISTORY');
  });

  it('should limit conversation history to last 5 messages', () => {
    const history = Array.from({ length: 10 }, (_, i) => ({
      role: 'user' as const,
      content: `Message ${i}`
    }));

    const prompt = buildPrompt({
      exerciseSlug: 'hello-world',
      code: 'test',
      question: 'test',
      history
    });

    // Should include messages 5-9 (last 5)
    expect(prompt).toContain('Message 5');
    expect(prompt).toContain('Message 9');
    // Should not include messages 0-4
    expect(prompt).not.toContain('Message 0');
    expect(prompt).not.toContain('Message 4');
  });

  it('should throw error for unknown exercise', () => {
    expect(() => {
      buildPrompt({
        exerciseSlug: 'non-existent-exercise',
        code: 'test',
        question: 'test',
        history: []
      });
    }).toThrow('Exercise not found');
  });
});
```

### 3. Rate Limiter Tests (`tests/rate-limiter.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit } from '../src/rate-limiter';

describe('Rate Limiter', () => {
  const mockEnv = {};

  beforeEach(() => {
    // Reset rate limiter between tests
    // Note: This requires exporting the store or adding a reset function
  });

  it('should allow first request', async () => {
    const allowed = await checkRateLimit('user-123', mockEnv);
    expect(allowed).toBe(true);
  });

  it('should allow multiple requests under limit', async () => {
    for (let i = 0; i < 50; i++) {
      const allowed = await checkRateLimit('user-123', mockEnv);
      expect(allowed).toBe(true);
    }
  });

  it('should block requests over limit', async () => {
    // Make 50 requests (at limit)
    for (let i = 0; i < 50; i++) {
      await checkRateLimit('user-123', mockEnv);
    }

    // 51st request should be blocked
    const allowed = await checkRateLimit('user-123', mockEnv);
    expect(allowed).toBe(false);
  });

  it('should track different users separately', async () => {
    // User 1 hits limit
    for (let i = 0; i < 50; i++) {
      await checkRateLimit('user-1', mockEnv);
    }

    // User 2 should still be allowed
    const allowed = await checkRateLimit('user-2', mockEnv);
    expect(allowed).toBe(true);
  });
});
```

### 4. Integration Tests (`tests/integration.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';

describe('LLM Chat Proxy Integration', () => {
  const baseUrl = 'http://localhost:8787';

  it('should return health check', async () => {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.service).toBe('llm-chat-proxy');
  });

  it('should reject requests without token', async () => {
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exerciseSlug: 'hello-world',
        code: 'test',
        question: 'test'
      })
    });

    expect(response.status).toBe(401);
  });

  it('should reject requests with invalid token', async () => {
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      },
      body: JSON.stringify({
        exerciseSlug: 'hello-world',
        code: 'test',
        question: 'test'
      })
    });

    expect(response.status).toBe(401);
  });

  it('should reject requests missing required fields', async () => {
    // TODO: Generate valid test token
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer valid-test-token'
      },
      body: JSON.stringify({
        exerciseSlug: 'hello-world'
        // Missing code and question
      })
    });

    expect(response.status).toBe(400);
  });
});
```

---

## Development Workflow

### Local Development

```bash
# Start local dev server
cd llm-chat-proxy
pnpm dev

# Server runs on http://localhost:8787

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type check
pnpm typecheck
```

### Deployment

```bash
# Set secrets (one time)
cd llm-chat-proxy
wrangler secret put GOOGLE_GEMINI_API_KEY
wrangler secret put DEVISE_JWT_SECRET_KEY
wrangler secret put RAILS_API_URL
wrangler secret put INTERNAL_API_SECRET

# Deploy to production
pnpm deploy

# View logs
wrangler tail
```

---

## Frontend Integration (app/ package)

### 1. Create API Client (`lib/api/llm-chat.ts`)

```typescript
import { getToken } from '@/lib/auth/storage';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const LLM_CHAT_URL = process.env.NEXT_PUBLIC_LLM_CHAT_URL || 'http://localhost:8787';

export async function streamChatResponse(
  exerciseSlug: string,
  code: string,
  question: string,
  history: ChatMessage[],
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: Error) => void
): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`${LLM_CHAT_URL}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        exerciseSlug,
        code,
        question,
        history: history.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    // Stream response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete(fullResponse);
        break;
      }

      const chunk = decoder.decode(value);
      fullResponse += chunk;
      onChunk(chunk);
    }

  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}
```

### 2. Create Chat Component (`components/coding-exercise/ui/ChatPanel.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { streamChatResponse, type ChatMessage } from '@/lib/api/llm-chat';

interface ChatPanelProps {
  exerciseSlug: string;
  getCurrentCode: () => string;
}

export function ChatPanel({ exerciseSlug, getCurrentCode }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput('');
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add placeholder for assistant message
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(true);

    // Stream response
    await streamChatResponse(
      exerciseSlug,
      getCurrentCode(),
      question,
      messages,
      // On chunk
      (chunk) => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.content += chunk;
          }
          return updated;
        });
      },
      // On complete
      () => {
        setIsLoading(false);
      },
      // On error
      (err) => {
        setError(err.message);
        setIsLoading(false);
        // Remove failed assistant message
        setMessages(prev => prev.slice(0, -1));
      }
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <div className="text-xs font-semibold mb-1">
                {msg.role === 'user' ? 'You' : 'Tutor'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your code..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 3. Integrate into CodingExercise

```typescript
// components/coding-exercise/CodingExercise.tsx
import { ChatPanel } from './ui/ChatPanel';

export function CodingExercise({ exerciseSlug }: { exerciseSlug: string }) {
  const orchestrator = useCodingExerciseOrchestrator(/* ... */);

  return (
    <div className="coding-exercise grid grid-cols-2 gap-4">
      <div>
        {/* Existing editor, scrubber, etc. */}
      </div>

      <div className="h-[600px]">
        <ChatPanel
          exerciseSlug={exerciseSlug}
          getCurrentCode={() => orchestrator.getCode()}
        />
      </div>
    </div>
  );
}
```

### 4. Environment Variables

```bash
# app/.env.local (development)
NEXT_PUBLIC_LLM_CHAT_URL=http://localhost:8787

# Production (Cloudflare Pages)
NEXT_PUBLIC_LLM_CHAT_URL=https://llm.jiki.app
```

---

## What to Copy from Rails to Proxy

### 1. JWT Secret (Critical)

**From Rails:**
```bash
cd /path/to/jiki/api
EDITOR=vim rails credentials:edit

# Copy the value of: devise_jwt_secret_key
```

**Add to Cloudflare Workers:**
```bash
cd front-end/llm-chat-proxy
wrangler secret put DEVISE_JWT_SECRET_KEY
# Paste the exact secret from Rails credentials
```

**IMPORTANT:** This must be the exact same secret. Any difference will cause JWT validation to fail.

### 2. Internal API Secret (New)

Create a new shared secret for internal API communication between proxy and Rails:

```bash
# Generate a secure random secret
openssl rand -hex 32

# Add to Rails credentials
EDITOR=vim rails credentials:edit
# Add line: internal_api_secret: "your-generated-secret"

# Add to Cloudflare Workers
cd front-end/llm-chat-proxy
wrangler secret put INTERNAL_API_SECRET
# Paste the same secret
```

### 3. Rails API URL

```bash
cd front-end/llm-chat-proxy
wrangler secret put RAILS_API_URL
# Development: http://localhost:3061
# Production: https://api.jiki.app
```

### 4. Google Gemini API Key

```bash
cd front-end/llm-chat-proxy
wrangler secret put GOOGLE_GEMINI_API_KEY
# Get key from: https://aistudio.google.com/apikey
```

---

## Rails API Changes Required

### 1. Create Internal API Controller

```ruby
# app/controllers/api/internal/base_controller.rb
module Api
  module Internal
    class BaseController < ApplicationController
      skip_before_action :authenticate_user!
      before_action :validate_internal_request

      private

      def validate_internal_request
        secret = request.headers['X-Internal-Secret']
        expected_secret = Rails.application.credentials.internal_api_secret

        unless ActiveSupport::SecurityUtils.secure_compare(secret.to_s, expected_secret.to_s)
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
    end
  end
end
```

### 2. Create Conversations Controller

```ruby
# app/controllers/api/internal/llm/conversations_controller.rb
module Api
  module Internal
    module Llm
      class ConversationsController < Api::Internal::BaseController
        def create
          user = User.find(params[:user_id])
          exercise_slug = params[:exercise_slug]
          messages = params[:messages]

          messages.each do |message|
            LlmConversation.create!(
              user: user,
              exercise_slug: exercise_slug,
              role: message[:role],
              content: message[:content],
              tokens_used: message[:tokens],
              created_at: params[:timestamp] || Time.current
            )
          end

          head :created
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'User not found' }, status: :not_found
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      end
    end
  end
end
```

### 3. Create LlmConversation Model

```ruby
# app/models/llm_conversation.rb
class LlmConversation < ApplicationRecord
  belongs_to :user

  validates :role, presence: true, inclusion: { in: %w[user assistant] }
  validates :content, presence: true
  validates :exercise_slug, presence: true
  validates :tokens_used, numericality: { greater_than_or_equal_to: 0 }
end
```

### 4. Create Migration

```ruby
# db/migrate/YYYYMMDDHHMMSS_create_llm_conversations.rb
class CreateLlmConversations < ActiveRecord::Migration[8.1]
  def change
    create_table :llm_conversations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :exercise_slug, null: false
      t.string :role, null: false
      t.text :content, null: false
      t.integer :tokens_used, default: 0
      t.timestamps
    end

    add_index :llm_conversations, [:user_id, :exercise_slug, :created_at]
    add_index :llm_conversations, :created_at
  end
end
```

### 5. Add Routes

```ruby
# config/routes.rb
namespace :api do
  namespace :internal do
    namespace :llm do
      resources :conversations, only: [:create]
    end
  end
end
```

---

## Curriculum Package Requirements

The `curriculum` package must export a function to get exercise data:

```typescript
// curriculum/src/index.ts
export function getExercise(slug: string): Exercise | null {
  // Return exercise data or null if not found
  return exercises[slug] || null;
}

export interface Exercise {
  slug: string;
  title: string;
  description?: string;
  learningObjectives?: string[];
  hints?: string[];
  commonMistakes?: string[];
  // ... other fields
}
```

If this doesn't exist, add it to the curriculum package.

---

## Success Metrics

- **Response time:** < 1.5 seconds average (JWT validation + Gemini streaming)
- **JWT validation:** < 1ms (local, no Rails call)
- **Exercise context lookup:** < 0.001ms (in-memory from bundled curriculum)
- **Cost per message:** < $0.0004 (Gemini 2.5 Flash-Lite)
- **Rate limit:** 50 messages/hour per user
- **Uptime:** 99.9% (Cloudflare Workers SLA)
- **Bundle size:** < 500KB compressed (well under 1MB limit)

---

## Deployment Checklist

- [ ] Create `llm-chat-proxy/` package in monorepo
- [ ] Implement core functionality (auth, streaming, prompt building)
- [ ] Add curriculum package dependency
- [ ] Write comprehensive tests
- [ ] Set up Cloudflare Workers secrets
- [ ] Deploy to Cloudflare Workers
- [ ] Add Rails internal API endpoints
- [ ] Run Rails migration
- [ ] Create internal API secret and add to both Rails and Workers
- [ ] Copy JWT secret from Rails to Workers
- [ ] Test end-to-end flow
- [ ] Integrate chat component into frontend exercise UI
- [ ] Add environment variables to frontend
- [ ] Test in production
- [ ] Monitor costs and usage

---

## Future Enhancements

### Phase 2 - Production Hardening
- Migrate rate limiting to Cloudflare KV or Durable Objects (for multi-region consistency)
- Add analytics/monitoring (Cloudflare Analytics)
- Add cost tracking per user/exercise
- Implement conversation persistence on client (localStorage)

### Phase 3 - Advanced Features
- Caching similar questions (semantic search)
- A/B test different prompts
- User feedback on responses (thumbs up/down)
- Progressive disclosure of hints based on conversation
- Integration with test runner (show which test is failing in context)

### Phase 4 - Intelligence
- Analyze common questions per exercise to improve hints
- Identify struggling students for instructor intervention
- Personalize responses based on user history
- Multi-turn conversation with follow-ups
