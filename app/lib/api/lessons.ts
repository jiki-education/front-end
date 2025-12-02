import { api } from "./client";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

export interface VideoSource {
  host: string; // Backend uses 'host' instead of 'provider'
  id: string; // The Mux playback ID
}

export interface LessonData {
  slug: string;
  type: "exercise" | "video";
  title: string;
  description?: string;
  data?:
    | {
        sources?: VideoSource[];
        // Add other data fields as needed
      }
    | any; // Allow any structure for now to debug
}

export interface LessonResponse {
  lesson?: LessonData;
  // The API might return the data directly without wrapping in "lesson"
  [key: string]: any;
}

export interface UserLessonData {
  lesson_slug: string;
  status: "started" | "completed";
  conversation: ChatMessage[];
  data: any;
}

export interface UserLessonResponse {
  user_lesson: UserLessonData;
}

/**
 * Fetch lesson details by slug
 */
export async function fetchLesson(slug: string): Promise<LessonData> {
  const response = await api.get<any>(`/internal/lessons/${slug}`);

  // Handle different response structures
  // If the response has a "lesson" key, use it; otherwise, assume the response is the lesson data
  const lessonData: LessonData = response.data.lesson || response.data;

  return lessonData;
}

/**
 * Mark a lesson as completed
 */
export async function markLessonComplete(slug: string): Promise<any> {
  const response = await api.patch(`/internal/user_lessons/${slug}/complete`);
  return response.data;
}

/**
 * Start tracking a lesson - called when user clicks on a lesson
 */
export async function startLesson(slug: string): Promise<void> {
  await api.post(`/internal/user_lessons/${slug}/start`);
}

/**
 * Fetch user lesson data including conversation history
 */
export async function fetchUserLesson(slug: string): Promise<UserLessonData> {
  try {
    const response = await api.get<UserLessonResponse>(`/internal/user_lessons/${slug}`);
    return response.data.user_lesson;
  } catch (error) {
    // Enhance error messages for better debugging and frontend handling
    if (error instanceof Error) {
      // If the API returns a server error (500), check if it's a database schema issue
      if (error.message.includes("500")) {
        throw new Error(
          "Server error occurred while fetching user lesson data. This may be due to a database schema issue."
        );
      }

      // If the API returns 404, it's likely the user lesson doesn't exist
      if (error.message.includes("404")) {
        throw new Error("User lesson not found");
      }
    }

    throw error;
  }
}
