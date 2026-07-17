import { api, NotFoundError } from "./client";
import type { LessonWithData } from "@/types/lesson";
import type { UserConversationData } from "./types/conversation";

export interface LessonResponse {
  lesson: LessonWithData;
}

export interface UserLessonData extends UserConversationData {
  lesson_slug: string;
}

export interface UserLessonResponse {
  user_lesson: UserLessonData;
}

/**
 * Fetch lesson details by slug
 */
export async function fetchLesson(slug: string): Promise<LessonWithData> {
  const response = await api.get<LessonResponse>(`/internal/lessons/${slug}`);
  return response.data.lesson;
}

/**
 * Mark a lesson as completed
 */
export async function markLessonComplete(slug: string): Promise<any> {
  const response = await api.patch(`/internal/user_lessons/${slug}/complete`);
  return response.data;
}

/**
 * Start tracking a lesson and return the resulting user lesson.
 *
 * Idempotent: creates the UserLesson row if it doesn't exist yet, otherwise
 * returns the existing one. The lesson page calls this on mount so the row is
 * guaranteed to exist (and its status is known) in a single request, rather
 * than reading, 404ing, starting, then re-reading.
 */
export async function startLesson(slug: string): Promise<UserLessonData> {
  const response = await api.post<UserLessonResponse>(`/internal/user_lessons/${slug}/start`);
  return response.data.user_lesson;
}

export interface ExerciseSubmissionFile {
  filename: string;
  content: string;
}

export interface LessonSubmissionFile {
  filename: string;
  code: string;
}

interface CreatedExerciseSubmissionResponse {
  submission?: { uuid?: string };
}

/**
 * Submit exercise files for a lesson. Returns the created submission's uuid,
 * or null when the response doesn't include one (e.g. the API doesn't return
 * it yet).
 */
export async function submitLessonExercise(slug: string, files: LessonSubmissionFile[]): Promise<string | null> {
  const response = await api.post<CreatedExerciseSubmissionResponse | null>(
    `/internal/lessons/${slug}/exercise_submissions`,
    { submission: { files } }
  );
  return response.data?.submission?.uuid ?? null;
}

export interface LatestExerciseSubmission {
  uuid: string;
  context_type: string;
  context_slug: string;
  files: ExerciseSubmissionFile[];
}

interface LatestExerciseSubmissionResponse {
  submission: LatestExerciseSubmission;
}

/**
 * Fetch the latest exercise submission for a lesson.
 * Returns null if no submission exists (404) or on error.
 */
export async function fetchLatestExerciseSubmission(lessonSlug: string): Promise<LatestExerciseSubmission | null> {
  try {
    const response = await api.get<LatestExerciseSubmissionResponse>(
      `/internal/lessons/${lessonSlug}/exercise_submissions/latest`,
      undefined,
      false
    );
    return response.data.submission;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    console.warn("Failed to fetch latest exercise submission:", error);
    return null;
  }
}

/**
 * Submit difficulty and fun ratings for a lesson
 */
export async function rateLesson(slug: string, difficultyRating: number, funRating: number): Promise<void> {
  await api.patch(`/internal/user_lessons/${slug}/rate`, {
    difficulty_rating: difficultyRating,
    fun_rating: funRating
  });
}

/**
 * Update walkthrough video watched percentage
 */
export async function updateWalkthroughVideoPercentage(slug: string, percentage: number): Promise<void> {
  await api.patch(
    `/internal/user_lessons/${slug}/walkthrough_video_percentage`,
    {
      percentage: Math.round(percentage)
    },
    undefined,
    false
  );
}

/**
 * Fetch user lesson data including conversation history.
 * Throws NotFoundError if the user lesson (or underlying lesson) doesn't exist.
 */
export async function fetchUserLesson(slug: string): Promise<UserLessonData> {
  const response = await api.get<UserLessonResponse>(`/internal/user_lessons/${slug}`);
  return response.data.user_lesson;
}
