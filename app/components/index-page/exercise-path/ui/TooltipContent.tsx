import Link from "next/link";
import type { MouseEvent } from "react";
import type { Exercise } from "../../lib/mockData";
import { formatDifficulty, getDifficultyBadgeClasses, getDifficultyColor, getTypeLabel } from "../lib/exerciseUtils";
import { CodingIcon, CompletedIcon, QuizIcon, TimeIcon, VideoIcon, XpIcon } from "./ExerciseIcons";

interface TooltipContentProps {
  exercise: Exercise;
  onClose: () => void;
  onNavigate?: (route: string) => void;
  headingId?: string;
  descriptionId?: string;
}

function ExerciseIcon({ type }: { type: Exercise["type"] }) {
  switch (type) {
    case "coding":
      return <CodingIcon />;
    case "video":
      return <VideoIcon />;
    case "quiz":
      return <QuizIcon />;
    default:
      return null;
  }
}

export function TooltipContent({ exercise, onClose, onNavigate, headingId, descriptionId }: TooltipContentProps) {
  const handleLessonStart = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose(); // Close tooltip immediately
    if (onNavigate) {
      onNavigate(exercise.route); // Let parent handle navigation with loading state
    }
  };
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 ${getDifficultyColor(exercise.difficulty)}`}>
        <ExerciseIcon type={exercise.type} />
      </div>
      <div className="flex-1">
        <h3 id={headingId} className="font-semibold text-gray-900 text-base">
          {exercise.title}
        </h3>
        <p id={descriptionId} className="text-sm text-gray-600 mt-1">
          {exercise.description}
        </p>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <TimeIcon />
            {exercise.estimatedTime} min
          </span>
          <span className="flex items-center gap-1">
            <XpIcon />
            {exercise.xpReward} XP
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyBadgeClasses(exercise.difficulty)}`}
          >
            {formatDifficulty(exercise.difficulty)}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {getTypeLabel(exercise.type)}
          </span>
        </div>

        {exercise.completed && (
          <div className="flex items-center gap-1 mt-3 text-green-600">
            <CompletedIcon />
            <span className="text-xs font-medium">Completed</span>
          </div>
        )}

        <Link
          href={exercise.route}
          onClick={handleLessonStart}
          className={`mt-4 w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-block text-center ${
            exercise.completed
              ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {exercise.completed ? "Review Lesson" : "Start Lesson"}
        </Link>
      </div>
    </div>
  );
}
