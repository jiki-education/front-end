import { api } from "./client";

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
