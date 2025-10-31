# LLM Chat Proxy - Agent Instructions

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch using git worktree:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create an isolated worktree directory with a new branch
git worktree add ../../worktrees/front-end-llm-chat-proxy-feature -b feature-branch-name

# 3. Change to the worktree directory
cd ../../worktrees/front-end-llm-chat-proxy-feature/llm-chat-proxy
```

This isolates your work in a separate directory. Never work directly in the main repository directory.

---

## Repository Overview

This package provides an LLM-powered chat proxy service for coding exercises, deployed on Cloudflare Workers. It allows students to ask questions about their code and receive contextual help powered by Google Gemini 2.0 Flash.

### Key Features

- **Edge deployment**: Runs globally on Cloudflare Workers for minimal latency
- **Streaming responses**: Real-time token streaming from Gemini API
- **JWT authentication**: Validates user tokens from Rails (Devise JWT)
- **Rate limiting**: 50 messages per hour per user (in-memory, sliding window)
- **Exercise context**: Bundles curriculum package for zero-latency exercise data access
- **Async persistence**: Saves conversations to Rails API after streaming completes

### Architecture

- **Framework**: Hono (lightweight web framework for Workers)
- **LLM**: Google Gemini 2.0 Flash (~$0.0004 per message)
- **Runtime**: Cloudflare Workers (Edge Runtime)
- **Dependencies**: `@jiki/curriculum` for exercise context

---

## Key Documentation

Context files explain implementation details:

- **[.context/README.md](.context/README.md)** - Overview of technical architecture

---

## Integration with Jiki Ecosystem

### Dependencies

```
llm-chat-proxy → curriculum → interpreters
```

The proxy bundles the curriculum package to access exercise metadata (title, instructions, hints, tasks) when building prompts.

### External Services

- **Google Gemini API**: LLM for generating responses
- **Rails API**: Async conversation persistence (POST /api/internal/llm/conversations)
- **Frontend**: Receives streaming responses from /chat endpoint

---

## Development Workflow

### Local Development

```bash
# Start local development server (requires .dev.vars file)
pnpm dev

# Server runs on http://localhost:8787
```

### Environment Setup

Create `.dev.vars` file (copy from `.dev.vars.example`):

```
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
DEVISE_JWT_SECRET_KEY=your_devise_jwt_secret_from_rails
RAILS_API_URL=http://localhost:3061
INTERNAL_API_SECRET=shared_secret_with_rails
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:ui

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format check
pnpm format:check
```

### Deployment

```bash
# Set secrets (one time only)
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

## Project Structure

```
llm-chat-proxy/
├── src/
│   ├── index.ts              # Main Hono app with /chat and /health endpoints
│   ├── auth.ts               # JWT verification (jose library)
│   ├── gemini.ts             # Gemini API streaming integration
│   ├── prompt-builder.ts     # Builds prompts using curriculum data
│   ├── rate-limiter.ts       # In-memory rate limiting (50/hour)
│   ├── rails-client.ts       # Async conversation saving to Rails
│   └── types.ts              # TypeScript interfaces
├── tests/
│   ├── auth.test.ts          # JWT authentication tests
│   ├── prompt-builder.test.ts # Prompt building tests
│   ├── rate-limiter.test.ts  # Rate limiting tests
│   └── rails-client.test.ts  # Rails API client tests
├── .context/
│   └── README.md             # Technical documentation
├── scripts/
│   └── pre-commit            # Pre-commit validation script
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript config (includes tests)
├── tsconfig.build.json       # TypeScript build config (excludes tests)
├── vitest.config.ts          # Vitest test configuration
├── eslint.config.mjs         # ESLint flat config
├── wrangler.toml             # Cloudflare Workers config
└── .dev.vars.example         # Example environment variables
```

---

## Core Concepts

### Request Flow

```
Client → /chat endpoint
  ↓
JWT validation (edge, <1ms)
  ↓
Rate limit check (in-memory)
  ↓
Exercise context lookup (curriculum package, <0.001ms)
  ↓
Prompt building
  ↓
Gemini streaming (~1s first token)
  ↓
Client (streaming response)
  ↓
Rails API (async save, non-blocking)
```

### Prompt Structure

Prompts include:

- Exercise title and instructions
- Available hints
- Task list
- Student's current code
- Conversation history (last 5 messages)
- Student's question
- Tutoring guidelines (don't give away solutions, teach concepts)

### Rate Limiting

- In-memory Map with sliding window
- 50 messages per hour per user
- Automatic cleanup of expired entries
- TODO: Migrate to Cloudflare KV/Durable Objects for multi-region consistency

### Authentication

- Validates JWT tokens from Rails (Devise JWT)
- Uses shared secret (`DEVISE_JWT_SECRET_KEY`)
- Extracts user ID from `sub` claim
- Checks expiration (`exp` claim)

---

## Common Commands

```bash
# Development
pnpm dev                    # Start local dev server

# Testing
pnpm test                   # Run tests
pnpm test:ui                # Run tests with UI
pnpm typecheck              # Type checking

# Code quality
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier
pnpm format:check           # Check formatting

# Deployment
pnpm deploy                 # Deploy to Cloudflare Workers
wrangler tail               # View live logs
wrangler dev                # Local development (alias for pnpm dev)
```

---

## Important Rules

1. **Never commit secrets**: Use `.dev.vars` for local development (git ignored)
2. **Match Rails JWT secret exactly**: Any mismatch causes authentication failures
3. **Cost awareness**: Gemini 2.0 Flash costs ~$0.0004/message; monitor usage
4. **Streaming is critical**: Don't buffer entire response; stream to minimize latency
5. **Non-blocking persistence**: Use `executionCtx.waitUntil()` for Rails API calls
6. **Rate limit is in-memory**: Resets on Worker restart; migrate to KV for production

---

## Contact for Questions

If you're unsure about implementation details or architecture decisions, ask the user for clarification before proceeding.
