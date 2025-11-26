# LLM Chat Proxy - Technical Context

This document provides technical details about the LLM chat proxy implementation.

## Architecture Overview

The LLM chat proxy is a Cloudflare Workers service that provides real-time AI tutoring for coding exercises. It sits between the frontend and Google Gemini API, handling authentication, rate limiting, and context injection.

### Why Cloudflare Workers?

- **Global edge deployment**: Low latency worldwide
- **Serverless**: No infrastructure management
- **Cost-effective**: Pay per request
- **Native streaming**: First-class support for streaming responses
- **Fast cold starts**: <10ms typically

### Why Bundle Curriculum?

The proxy bundles `@jiki/curriculum` directly rather than fetching exercise data via API:

- **Zero latency**: Exercise data is in-memory
- **No network calls**: Reduces request complexity
- **Type safety**: Full TypeScript support
- **Small bundle**: ~200-250KB compressed (well under 1MB limit)
- **Always available**: No dependency on external services

## Authentication Flow

```
1. Frontend includes JWT in Authorization header
2. Proxy extracts Bearer token
3. Proxy verifies JWT signature using shared secret
4. Proxy extracts user ID from 'sub' claim
5. Proxy checks expiration
6. If valid, process request; if invalid, return 401
```

**Critical**: The `DEVISE_JWT_SECRET_KEY` must match Rails EXACTLY. Copy from:

```bash
cd /path/to/jiki/api
EDITOR=vim rails credentials:edit
# Copy: devise_jwt_secret_key
```

## Gemini Streaming

The proxy uses the Google Generative AI SDK for Node.js to stream responses:

```typescript
const result = await model.generateContentStream({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7, // Balance creativity and consistency
    topP: 0.9, // Nucleus sampling
    topK: 40, // Top-K sampling
    maxOutputTokens: 2048 // Limit response length
  }
});
```

The stream is converted to a Web Stream API ReadableStream for Cloudflare Workers compatibility.

## Rate Limiting Strategy

**Current Implementation** (MVP):

- In-memory Map with user ID as key
- Sliding window: 50 requests per hour
- Resets on Worker restart
- Periodic cleanup of expired entries (when store > 10,000 entries)

**Limitations**:

- Not shared across Worker instances
- Lost on restart
- Not suitable for multi-region deployment

**Future Enhancement**:
Migrate to Cloudflare KV or Durable Objects for persistent, distributed rate limiting.

## Prompt Engineering

Prompts are structured to maximize teaching effectiveness:

1. **System role**: "You are a helpful coding tutor"
2. **Exercise context**: Title, instructions, hints, tasks
3. **Student code**: Current code with syntax highlighting
4. **Conversation history**: Last 5 messages for context
5. **Current question**: Student's specific question
6. **Guidelines**: Don't give solutions, teach concepts, ask questions

**Token Management**:

- Limit history to 5 messages to control token count
- Estimate: ~1 token per 4 characters
- Max output: 2048 tokens (~8000 characters)
- Average cost: $0.0004 per conversation turn

## Rails Integration

After streaming completes, the proxy asynchronously saves the conversation to Rails:

```
POST /api/internal/llm/conversations
Headers:
  Content-Type: application/json
  X-Internal-Secret: <shared secret>
Body:
  {
    user_id: "123",
    exercise_slug: "basic-movement",
    messages: [
      { role: "user", content: "...", tokens: 50 },
      { role: "assistant", content: "...", tokens: 120 }
    ],
    timestamp: "2025-10-31T..."
  }
```

**Non-blocking**: Uses `executionCtx.waitUntil()` to prevent blocking the response stream.

**Error handling**: Logs errors but never throws (conversation loss is preferable to user-facing errors).

## Error Handling

### Authentication Errors (401)

- Invalid JWT format
- Expired token
- Wrong secret
- Missing token

### Rate Limiting (429)

- User exceeded 50 messages/hour
- Response includes error message with limit info

### Validation Errors (400)

- Missing required fields (exerciseSlug, code, question)

### Server Errors (500)

- Exercise not found
- Gemini API errors
- Unexpected runtime errors

All errors are logged with details for debugging but return generic messages to users for security.

## Testing Strategy

### Unit Tests

- **auth.test.ts**: JWT validation with various scenarios
- **prompt-builder.test.ts**: Prompt generation with different inputs
- **rate-limiter.test.ts**: Rate limiting logic
- **rails-client.test.ts**: API client with mocked fetch

### Test Isolation

- Each test uses unique user IDs to avoid collisions
- In-memory stores persist across tests (by design)
- Mocks for external dependencies (Gemini API, Rails API)

### Integration Testing

In production, test with:

```bash
curl -X POST http://localhost:8787/chat \
  -H "Authorization: Bearer <valid-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseSlug": "basic-movement",
    "code": "console.log(\"test\");",
    "question": "How do I fix this?"
  }'
```

## Performance Metrics

Target metrics:

- **JWT validation**: <1ms (local, no network)
- **Exercise lookup**: <0.001ms (in-memory)
- **First token**: ~1s (Gemini API)
- **Full response**: ~3-5s (varies by length)
- **Total overhead**: <10ms (auth + lookup + prompt building)

## Security Considerations

1. **JWT Secret Protection**: Never log or expose the JWT secret
2. **Input Validation**: Sanitize all user inputs (code, questions)
3. **Rate Limiting**: Prevent abuse and control costs
4. **CORS**: Restrict origins to jiki.io (production) and localhost (development)
5. **Internal API Secret**: Use for Rails API authentication
6. **Error Messages**: Don't leak implementation details

## Cost Management

**Gemini 2.0 Flash Pricing** (as of implementation):

- Input: $0.10 per 1M tokens
- Output: $0.40 per 1M tokens
- Typical conversation: ~150 input tokens, ~300 output tokens
- Cost per message: ~$0.0004

**Monthly Estimates**:

- 50K messages/month: ~$20
- 100K messages/month: ~$40
- 500K messages/month: ~$200

**Cloudflare Workers**:

- 100K requests/day free
- $0.50 per million requests after
- Minimal cost for expected usage

## Deployment Checklist

Before deploying:

- [ ] Set all Cloudflare secrets (GOOGLE_GEMINI_API_KEY, etc.)
- [ ] Verify JWT secret matches Rails
- [ ] Test with production Rails API
- [ ] Configure route in wrangler.toml
- [ ] Update frontend to use production URL
- [ ] Monitor initial requests for errors
- [ ] Check Gemini API quota and limits

## Troubleshooting

### "Invalid or expired token" (401)

- JWT secret mismatch between Rails and Workers
- Token expired (check exp claim)
- Token format invalid

### "Exercise not found" (500)

- Exercise slug doesn't exist in curriculum
- Curriculum package not built
- Typo in exercise slug

### "Rate limit exceeded" (429)

- User hit 50 messages/hour limit
- Wait for window to reset
- Consider increasing limit if needed

### Streaming doesn't work

- Check Content-Type is text/event-stream
- Verify Gemini API key is valid
- Check Gemini API quotas

### Conversation not saved to Rails

- Check Rails API URL is correct
- Verify internal API secret matches
- Check Rails API logs for errors
- Non-critical: User experience not affected
