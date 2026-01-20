import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyJWT } from "./auth";
import { streamGeminiResponse } from "./gemini";
import { buildPrompt } from "./prompt-builder";
import { createSignaturePayload, generateSignature } from "./crypto";
import type { Bindings, ChatRequest } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// CORS for frontend
app.use(
  "/chat",
  cors({
    origin: (origin, c) => {
      // Detect environment based on request hostname
      const hostname = new URL(c.req.url).hostname;
      const isProduction = hostname === "chat.jiki.io";

      // Exact domain matching to prevent bypass attacks
      const allowedOrigins = isProduction
        ? ["https://jiki.io"] // Production: only jiki.io
        : [
            // Development: allow local origins
            "http://localhost:3061",
            "http://local.jiki.io:3061",
            "https://jiki.io" // Allow testing prod domain in dev
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
    console.log("[Chat] Incoming request");

    // 1. Extract and verify JWT from Authorization header
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      console.log("[Chat] ❌ No Authorization header");
      return c.json({ error: "Missing authorization token" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    console.log("[Chat] Token (first 20 chars):", token.substring(0, 20) + "...");

    const jwtResult = await verifyJWT(token, c.env.DEVISE_JWT_SECRET_KEY);
    if (!jwtResult.userId) {
      console.log(`[Chat] ❌ JWT verification failed - ${jwtResult.error}`);

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

    console.log("[Chat] ✅ JWT verified, user ID:", jwtResult.userId);
    const userId = jwtResult.userId;

    // 2. Parse request
    const body = await c.req.json<ChatRequest>();
    const { exerciseSlug, code, question, history = [], nextTaskId, language } = body;

    if (exerciseSlug === undefined || code === undefined || question === undefined || language === undefined) {
      return c.json({ error: "Missing required fields: exerciseSlug, code, question, language" }, 400);
    }

    // 2b. Validate exerciseSlug in request matches JWT claim
    if (jwtResult.exerciseSlug !== exerciseSlug) {
      console.log(`[Chat] ❌ Exercise mismatch: JWT=${jwtResult.exerciseSlug}, body=${exerciseSlug}`);
      return c.json(
        {
          error: "exercise_mismatch",
          message: "Exercise does not match token"
        },
        403
      );
    }

    // 3. Build prompt (uses curriculum package)
    const prompt = await buildPrompt({
      exerciseSlug,
      code,
      question,
      history,
      nextTaskId,
      language
    });

    // 4. Stream from Gemini and collect full response
    let fullResponse = "";
    const geminiStream = await streamGeminiResponse(prompt, c.env.GOOGLE_GEMINI_API_KEY, (chunk) => {
      fullResponse += chunk;
    });

    // 5. Create a new stream that includes the signature at the end
    const timestamp = new Date().toISOString();
    let signatureSent = false;

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
              userMessage: question
            })}\n\n`;
            controller.enqueue(encoder.encode(signatureMessage));
            signatureSent = true;
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
