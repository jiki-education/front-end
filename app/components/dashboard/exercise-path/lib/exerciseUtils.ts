import type { LessonType } from "@/types/lesson";

export function getExerciseTypeIcon(type: LessonType) {
  switch (type) {
    case "exercise":
      return "CodingIcon";
    case "video":
      return "VideoIcon";
    case "quiz":
      return "QuizIcon";
    default:
      return null;
  }
}

export function getTypeLabel(type: LessonType) {
  switch (type) {
    case "exercise":
      return "Exercise";
    case "video":
      return "Video Lesson";
    case "quiz":
      return "Quiz";
    default:
      return type;
  }
}
