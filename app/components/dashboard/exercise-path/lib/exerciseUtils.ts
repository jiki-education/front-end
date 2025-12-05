import type { LessonData } from "../types";

export function getExerciseTypeIcon(type: LessonData["type"]) {
  switch (type) {
    case "coding":
      return "CodingIcon";
    case "video":
      return "VideoIcon";
    case "quiz":
      return "QuizIcon";
    default:
      return null;
  }
}

export function getTypeLabel(type: LessonData["type"]) {
  switch (type) {
    case "coding":
      return "Exercise";
    case "video":
      return "Video Lesson";
    case "quiz":
      return "Quiz";
    default:
      return type;
  }
}
