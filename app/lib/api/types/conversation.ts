import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

/**
 * A file from the user's most recent exercise submission, embedded in the
 * per-user lesson/project payloads under `data.last_submission`.
 */
export interface LastSubmissionFile {
  filename: string;
  content: string;
}

/**
 * The user's most recent exercise submission for a lesson/project, used to
 * resume in-progress code across devices.
 */
export interface LastSubmissionData {
  files: LastSubmissionFile[];
  stored_at?: string;
}

/**
 * Per-user context data embedded under the `data` key of the user-lesson and
 * user-project endpoints.
 */
export interface UserContextData {
  last_submission?: LastSubmissionData;
}

/**
 * Per-user conversation data shared by the user-lesson and user-project
 * endpoints. Both `/internal/user_lessons/{slug}` and
 * `/internal/user_projects/{slug}` return this shape.
 */
export interface UserConversationData {
  status: "started" | "completed";
  conversation: ChatMessage[];
  conversation_allowed: boolean;
  data?: UserContextData;
}
