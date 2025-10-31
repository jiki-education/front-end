import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyJWT } from "./auth";
import { streamGeminiResponse } from "./gemini";
import { buildPrompt } from "./prompt-builder";
import { checkRateLimit } from "./rate-limiter";
import { saveConversationToRails } from "./rails-client";
import type { Bindings, ChatRequest } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// CORS for frontend
app.use(
  "/chat",
  cors({
    origin: (origin) => {
      // Allow localhost and production domains
      if (origin.includes("localhost") || origin.includes("jiki.app")) {
        return origin;
      }
      return "";
    },
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
    // 1. Extract and verify JWT
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token === undefined) {
      return c.json({ error: "Missing authorization token" }, 401);
    }

    const userId = await verifyJWT(token, c.env.DEVISE_JWT_SECRET_KEY);
    if (userId === null) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    // 2. Check rate limit
    const isAllowed = await checkRateLimit(userId);
    if (!isAllowed) {
      return c.json(
        {
          error: "Rate limit exceeded. Maximum 50 messages per hour."
        },
        429
      );
    }

    // 3. Parse request
    const body = await c.req.json<ChatRequest>();
    const { exerciseSlug, code, question, history = [] } = body;

    if (exerciseSlug === undefined || code === undefined || question === undefined) {
      return c.json({ error: "Missing required fields: exerciseSlug, code, question" }, 400);
    }

    // 4. Build prompt (uses curriculum package)
    const prompt = await buildPrompt({
      exerciseSlug,
      code,
      question,
      history
    });

    // 5. Stream from Gemini
    let fullResponse = "";
    const stream = await streamGeminiResponse(prompt, c.env.GOOGLE_GEMINI_API_KEY, (chunk) => {
      fullResponse += chunk;
    });

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
