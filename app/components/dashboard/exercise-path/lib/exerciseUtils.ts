import type { LessonType } from "@/types/lesson";

export function getExerciseTypeIcon(type: LessonType) {
  switch (type) {
    case "exercise":
      return "CodingIcon";
    case "video":
      return "VideoIcon";
    case "quiz":
      return "QuizIcon";
    case "choose_language":
      return "ChoiceIcon";
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
    case "choose_language":
      return "Language Choice";
  }
}
