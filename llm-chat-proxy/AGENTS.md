# LLM Chat Proxy - Agent Instructions

## ⚠️ CRITICAL: First Step for ANY Work

**Before starting ANY task, you MUST create a feature branch:**

```bash
# 1. Ensure you're on main and up-to-date
git checkout main && git pull

# 2. Create a new feature branch
git checkout -b feature-branch-name
```

---

## Overview

Cloudflare Workers proxy for LLM-powered coding help. Students ask questions about their code, get streaming responses from Gemini, signed with HMAC for Rails verification.

**Key Architecture Decisions:**

- Edge deployment for global low latency
- Bundles `@jiki/curriculum` for zero-latency exercise context (no DB lookup)
- HMAC signatures instead of direct Rails persistence (proxy is stateless)

---

## Development

### Setup

1. Copy `.dev.vars.example` to `.dev.vars` and fill in secrets (see wrangler.toml for required variables)
2. Run `pnpm dev` to start local server on http://localhost:8787
3. See package.json for all commands (test, typecheck, lint, deploy, etc.)

### Deployment

Set secrets with `wrangler secret put SECRET_NAME` then `pnpm deploy`. See wrangler.toml for required secrets.

---

## Critical Gotchas

1. **Shared secrets must match Rails exactly**: `DEVISE_JWT_SECRET_KEY` and `LLM_SIGNATURE_SECRET` must be identical to Rails config
2. **HMAC payload format is fragile**: See `crypto.ts` for exact format - any change breaks Rails verification
3. **Signature happens AFTER streaming**: If signature generation fails, user sees response but it won't save (error event sent to client)
4. **Input validation limits**: See `prompt-builder.ts` INPUT_LIMITS constant - enforced to prevent abuse
5. **Rate limiting is IP-based**: Configured in wrangler.toml (100/hour), not user-based
