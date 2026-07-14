import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyJWT } from "./auth";
import { streamGeminiResponse } from "./gemini";
import { buildPrompt, INPUT_LIMITS } from "./prompt-builder";
import { createSignaturePayload, generateSignature } from "./crypto";
import { checkUsage, recordUsage, buildUsageMeta } from "./usage";
import { debugLog, isDev } from "./log";
import type { Bindings, ChatRequest } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// CORS for frontend
app.use(
  "/chat",
  cors({
    origin: (origin) => {
      // All allowed origins - check the origin header directly
      const allowedOrigins = [
        // Production
        "https://jiki.io",
        // Development
        "http://localhost:3061",
        "http://local.jiki.io:3061"
      ];

      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return "";
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "OPTIONS"],
    credentials: true
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "llm-chat-proxy" });
});

// Main chat endpoint
app.post("/chat", async (c) => {
  try {
    debugLog("[Chat] Incoming request");

    // 1. Extract and verify JWT from Authorization header
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      debugLog("[Chat] ❌ No Authorization header");
      return c.json({ error: "Missing authorization token" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    debugLog("[Chat] Token (first 20 chars):", token.substring(0, 20) + "...");

    const jwtResult = await verifyJWT(token, c.env.DEVISE_JWT_SECRET_KEY);
    if (!jwtResult.userId) {
      debugLog(`[Chat] ❌ JWT verification failed - ${jwtResult.error}`);

      if (jwtResult.error === "expired") {
        return c.json(
          {
            error: "token_expired",
            message: "Token has expired"
          },
          401
        );
      }

      return c.json(
        {
          error: "invalid_token",
          message: "Invalid token"
        },
        401
      );
    }

    debugLog("[Chat] ✅ JWT verified, user ID:", jwtResult.userId);
    const userId = jwtResult.userId;

    // 1b. Per-user burst limit: 10 requests/minute, keyed on JWT sub.
    // Checked before building the prompt so throttled requests never reach Gemini.
    const { success } = await c.env.RATE_LIMITER.limit({ key: userId });
    if (!success) {
      debugLog(`[Chat] ⛔ Rate limited user ${userId}`);
      return c.json(
        {
          error: "rate_limited",
          message: "Too many requests. Please wait a moment and try again."
        },
        429
      );
    }

    // 1c. Per-user message caps: 100/day, 500/month (UTC), keyed on JWT sub.
    // Checked before any work so capped users never reach Gemini (no cost).
    const now = new Date();
    const usage = await checkUsage(c.env.USAGE_KV, userId, now);
    if (!usage.allowed) {
      debugLog(
        `[Chat] ⛔ ${usage.scope} cap reached for user ${userId} (day=${usage.counts.day}, month=${usage.counts.month})`
      );
      return c.json(
        {
          error: "usage_limit_reached",
          scope: usage.scope,
          ...buildUsageMeta(usage.counts)
        },
        429
      );
    }

    // 2. Parse request
    const body = await c.req.json<ChatRequest>();
    const { exerciseSlug, code, question, history = [], nextTaskId, language, contentHash } = body;

    if (exerciseSlug === undefined || code === undefined || question === undefined || language === undefined) {
      return c.json({ error: "Missing required fields: exerciseSlug, code, question, language" }, 400);
    }

    if (!contentHash) {
      return c.json({ error: "Missing required field: contentHash" }, 400);
    }

    // 2b. Validate exerciseSlug in request matches JWT claim
    if (jwtResult.exerciseSlug !== exerciseSlug) {
      debugLog(`[Chat] ❌ Exercise mismatch: JWT=${jwtResult.exerciseSlug}, body=${exerciseSlug}`);
      return c.json(
        {
          error: "exercise_mismatch",
          message: "Exercise does not match token"
        },
        403
      );
    }

    // 3. Fetch exercise content from app's static files and build prompt.
    //
    // In production we ALWAYS fetch from our own static bucket. The Origin header
    // is client-controlled (only browsers are forced to send a truthful value),
    // so trusting it in production would let a direct API caller point us at
    // arbitrary/oversized JSON. The header is only honoured in development so
    // local testing can hit localhost.
    const origin = isDev ? c.req.header("Origin") || "https://jiki.io" : "https://jiki.io";
    const contentUrl = `${origin}/static/exercises/${exerciseSlug}/en-${language}-${contentHash}.json`;

    const { systemInstruction, prompt } = await buildPrompt({
      exerciseSlug,
      code,
      question,
      history,
      nextTaskId,
      language,
      contentUrl
    });

    // 4. Stream from Gemini and collect the full response. The stream is opened
    // FIRST so that a failure to reach Gemini (e.g. all models rate limited, or
    // an API error) does NOT consume the user's quota - we only count requests
    // Gemini actually accepted.
    let fullResponse = "";
    const {
      stream: geminiStream,
      model,
      usage: usagePromise
    } = await streamGeminiResponse(prompt, c.env.GOOGLE_GEMINI_API_KEY, systemInstruction, (chunk) => {
      fullResponse += chunk;
    });

    // Now that Gemini has accepted the request and is streaming, record usage.
    // recordUsage returns the new totals (including this message) for the client.
    const usageCounts = await recordUsage(c.env.USAGE_KV, userId, now);

    // 5. Create a new stream that includes the signature at the end
    const timestamp = now.toISOString();

    const streamWithSignature = new ReadableStream({
      async start(controller) {
        const reader = geminiStream.getReader();
        const encoder = new TextEncoder();

        try {
          // Stream all chunks from Gemini
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }

          // One structured summary per successful request. Logged as an object
          // (not a string) so Workers Logs indexes each field for querying. This
          // is the ONLY log event a healthy request emits in production; all the
          // per-step tracing above goes through debugLog (dev only). `model`
          // doubles as the fallback signal (flash-lite => cascaded off flash).
          const u = await usagePromise;
          const cachedPct = u && u.inputTokens > 0 ? Math.round((u.cachedTokens / u.inputTokens) * 100) : 0;
          console.log({
            event: "chat",
            outcome: "ok",
            userId,
            exerciseSlug,
            language,
            model,
            inputTokens: u?.inputTokens ?? null,
            cachedTokens: u?.cachedTokens ?? null,
            cachedPct,
            outputTokens: u?.outputTokens ?? null,
            durationMs: Date.now() - now.getTime(),
            dayCount: usageCounts.day,
            monthCount: usageCounts.month,
            questionLen: question.length,
            codeLen: code.length,
            historyCount: history.length,
            codeCropped: code.length > INPUT_LIMITS.CODE_MAX_LENGTH
          });

          // Generate signature after streaming completes
          try {
            const payload = createSignaturePayload(userId, fullResponse, timestamp);
            const signature = await generateSignature(payload, c.env.LLM_SIGNATURE_SECRET);

            // Send signature as final SSE message
            const signatureMessage = `data: ${JSON.stringify({
              type: "signature",
              signature,
              timestamp,
              exerciseSlug,
              userMessage: question,
              ...buildUsageMeta(usageCounts)
            })}\n\n`;
            controller.enqueue(encoder.encode(signatureMessage));
          } catch (signatureError) {
            // Signature generation failed - send error event so client knows not to save
            console.error("Signature generation failed:", signatureError);
            const errorMessage = `data: ${JSON.stringify({
              type: "error",
              error: "signature_generation_failed",
              message: "Failed to generate signature. Response cannot be saved."
            })}\n\n`;
            controller.enqueue(encoder.encode(errorMessage));
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      }
    });

    // 6. Return streaming response
    return new Response(streamWithSignature, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});

export default app;
