import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

/**
 * Per-user conversation data shared by the user-lesson and user-project
 * endpoints. Both `/internal/user_lessons/{slug}` and
 * `/internal/user_projects/{slug}` return this shape.
 */
export interface UserConversationData {
  status: "started" | "completed";
  conversation: ChatMessage[];
  conversation_allowed: boolean;
}
