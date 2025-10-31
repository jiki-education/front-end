interface SaveConversationOptions {
  userId: string;
  exerciseSlug: string;
  userMessage: string;
  assistantMessage: string;
  railsApiUrl: string;
  internalSecret: string;
}

/**
 * Saves a conversation to Rails asynchronously.
 * This is called after streaming completes and does not block the response.
 *
 * @param options - Options for saving the conversation
 */
export async function saveConversationToRails(options: SaveConversationOptions): Promise<void> {
  const { userId, exerciseSlug, userMessage, assistantMessage, railsApiUrl, internalSecret } = options;

  try {
    const response = await fetch(`${railsApiUrl}/api/internal/llm/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": internalSecret
      },
      body: JSON.stringify({
        user_id: userId,
        exercise_slug: exerciseSlug,
        messages: [
          {
            role: "user",
            content: userMessage,
            tokens: estimateTokens(userMessage)
          },
          {
            role: "assistant",
            content: assistantMessage,
            tokens: estimateTokens(assistantMessage)
          }
        ],
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error("Failed to save conversation:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error saving conversation to Rails:", error);
    // Don't throw - we don't want to fail the user request if DB save fails
  }
}

/**
 * Rough token estimation (4 chars ≈ 1 token)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
