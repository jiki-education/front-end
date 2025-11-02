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
    origin: (origin) => {
      // Exact domain matching to prevent bypass attacks
      const allowedOrigins = [
        "http://localhost:3061",
        "http://local.jiki.io:3061",
        "https://jiki.app",
        "https://www.jiki.app"
      ];
      if (allowedOrigins.includes(origin)) {
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

    // 2. Parse request
    const body = await c.req.json<ChatRequest>();
    const { exerciseSlug, code, question, history = [] } = body;

    if (exerciseSlug === undefined || code === undefined || question === undefined) {
      return c.json({ error: "Missing required fields: exerciseSlug, code, question" }, 400);
    }

    // 3. Build prompt (uses curriculum package)
    const prompt = await buildPrompt({
      exerciseSlug,
      code,
      question,
      history
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
            const payload = createSignaturePayload(userId, exerciseSlug, fullResponse, timestamp);
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
