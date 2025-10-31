# LLM Chat Proxy

LLM-powered chat service for coding exercise help, deployed on Cloudflare Workers.

## Quick Start

### Development

```bash
# Copy environment variables template
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your API keys and secrets

# Start development server
pnpm dev

# Server runs on http://localhost:8787
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Deployment

```bash
# Set secrets (one time)
wrangler secret put GOOGLE_GEMINI_API_KEY
wrangler secret put DEVISE_JWT_SECRET_KEY
wrangler secret put RAILS_API_URL
wrangler secret put INTERNAL_API_SECRET

# Deploy
pnpm deploy

# View logs
wrangler tail
```

## API Endpoints

### POST /chat

Streams an AI response for a coding question.

**Headers:**

- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Body:**

```json
{
  "exerciseSlug": "basic-movement",
  "code": "console.log('hello');",
  "question": "How do I fix this?",
  "history": [
    { "role": "user", "content": "Previous question" },
    { "role": "assistant", "content": "Previous answer" }
  ]
}
```

**Response:** Text event stream (streaming response from Gemini)

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "service": "llm-chat-proxy"
}
```

## Architecture

- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono
- **LLM**: Google Gemini 2.0 Flash
- **Auth**: JWT (Devise JWT from Rails)
- **Rate Limiting**: 50 messages/hour per user (in-memory)
- **Exercise Context**: Bundled from `@jiki/curriculum` package

## Documentation

- **[AGENTS.md](AGENTS.md)** - Development guide for AI agents
- **[.context/README.md](.context/README.md)** - Technical implementation details

## Cost

Estimated cost per message: ~$0.0004 (Gemini 2.0 Flash)

## License

UNLICENSED - Proprietary
