import type { Exercise } from "../../lib/mockData";

export function getExerciseTypeIcon(type: Exercise["type"]) {
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

export function getDifficultyColor(difficulty: Exercise["difficulty"]) {
  switch (difficulty) {
    case "easy":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "hard":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

export function getDifficultyBadgeClasses(difficulty: Exercise["difficulty"]) {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getTypeLabel(type: Exercise["type"]) {
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

export function formatDifficulty(difficulty: string) {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
