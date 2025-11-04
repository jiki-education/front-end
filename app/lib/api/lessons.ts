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
export async function markLessonComplete(slug: string): Promise<void> {
  await api.patch(`/internal/user_lessons/${slug}/complete`);
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
  const response = await api.get<UserLessonResponse>(`/internal/user_lessons/${slug}`);
  return response.data.user_lesson;
}
