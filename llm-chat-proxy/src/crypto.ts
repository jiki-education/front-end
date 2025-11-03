/**
 * Generates an HMAC-SHA256 signature for LLM response verification.
 *
 * The signature proves that the response came from our llm-chat-proxy and hasn't been tampered with.
 * Rails will verify this signature before saving the conversation.
 *
 * @param payload - String to sign (must match Rails verification exactly)
 * @param secret - Shared secret key (same as Rails llm_signature_secret)
 * @returns Hex-encoded HMAC signature
 */
export async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);

  // Import the secret key for HMAC
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);

  // Generate signature
  const signature = await crypto.subtle.sign("HMAC", key, messageData);

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates the payload string that will be signed.
 * This format must match exactly what Rails expects for verification.
 *
 * @param userId - User ID from JWT
 * @param assistantMessage - Full LLM response
 * @param timestamp - ISO 8601 timestamp
 * @returns Payload string for signing
 */
export function createSignaturePayload(userId: string, assistantMessage: string, timestamp: string): string {
  return `${userId}:${assistantMessage}:${timestamp}`;
}
