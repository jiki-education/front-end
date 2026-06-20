# Front-end update: chat usage limits & usage meta

The `chat.jiki.io` proxy now enforces **per-user message quotas** and returns the
user's current usage on every response. This doc describes what the front-end
needs to handle.

## Summary of changes

1. New **429 `usage_limit_reached`** response when a user exceeds their quota.
2. **Usage meta keys** (`messagesToday`, `messagesThisMonth`, `dailyLimit`,
   `monthlyLimit`) are now returned on the successful response (in the final
   `signature` SSE event) and on the cap-rejection response.
3. There is also a separate **429 `rate_limited`** (short burst throttle) that
   already existed in spirit but is now active — handle it distinctly.

Quotas (keyed on the authenticated user, reset on **UTC** boundaries):

| Limit          | Value |
| -------------- | ----- |
| `dailyLimit`   | 100   |
| `monthlyLimit` | 500   |

## Successful response (unchanged transport, new fields)

Still a `text/event-stream`: text chunks stream first, then a final JSON event.
The final `signature` event now carries usage meta:

```json
{
  "type": "signature",
  "signature": "…",
  "timestamp": "2026-06-19T12:00:00.000Z",
  "exerciseSlug": "relational-traffic-lights",
  "userMessage": "how do I start?",
  "messagesToday": 7,
  "messagesThisMonth": 152,
  "dailyLimit": 100,
  "monthlyLimit": 500
}
```

- `messagesToday` / `messagesThisMonth` **include the message that was just
  served** (post-increment). So after a successful reply you can render
  `messagesToday` / `dailyLimit` directly, e.g. "7 / 100 today".
- These arrive at the **end** of the stream (with the signature), not before.

## Quota-exceeded response (new)

When the user is already at or above a cap, the request is rejected **before**
calling the LLM (no answer is streamed):

- **HTTP status:** `429`
- **Body:**

```json
{
  "error": "usage_limit_reached",
  "scope": "daily",
  "messagesToday": 100,
  "messagesThisMonth": 480,
  "dailyLimit": 100,
  "monthlyLimit": 500
}
```

- `scope` is `"daily"` or `"monthly"` (monthly takes precedence if both are hit).
- Counts here are **not** incremented (the message was not served).
- **No human-readable `message` field** — the FE owns the copy. Build the user-
  facing text from `scope` + the limits, e.g.:
  - `daily` → "You've used all 100 of today's messages. They reset at midnight UTC."
  - `monthly`→ "You've used all 500 messages this month. They reset on the 1st."

## Burst throttle (distinct 429)

Rapid-fire requests are throttled separately (≈10 requests / minute / user):

```json
{ "error": "rate_limited", "message": "Too many requests. Please wait a moment and try again." }
```

- **HTTP status:** `429`
- Distinguish from the quota case by the `error` field: `rate_limited`
  (transient — tell the user to wait a moment) vs `usage_limit_reached`
  (quota — won't recover until the reset).

## Recommended FE handling

1. On a successful reply, read the usage meta from the `signature` event and
   update any "messages left" UI. `remaining = dailyLimit - messagesToday`.
2. On a `429`, branch on `error`:
   - `usage_limit_reached` → show a quota message based on `scope`; disable the
     composer until the relevant reset (daily = next UTC midnight, monthly =
     next month). Optionally pre-empt this client-side once you know the user is
     at the cap from the last successful response.
   - `rate_limited` → transient; show "slow down" and allow retry shortly.
3. Other existing error/status codes are unchanged: `401` (`token_expired` /
   `invalid_token`), `403` (`exercise_mismatch`), `400` (missing fields), `500`.

## Notes / caveats

- Counts are **UTC**-bucketed. If you display reset times, compute them in UTC.
- Enforcement is backed by Cloudflare KV (eventually consistent), so under heavy
  concurrent use a user may very occasionally serve one or two messages past the
  cap. Treat the numbers as authoritative-enough for display, not exact billing.
