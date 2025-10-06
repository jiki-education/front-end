"use client";

import { startLesson } from "@/lib/api/lessons";
import type { LevelWithProgress } from "@/types/levels";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { type Exercise, generateMockExercises } from "../lib/mockData";
import NavigationLoadingOverlay from "@/components/common/NavigationLoadingOverlay";
import { ExerciseNode } from "./ExerciseNode";
import { LessonTooltip } from "./LessonTooltip";
import { PathConnection } from "./PathConnection";

interface ExercisePathProps {
  levels?: LevelWithProgress[];
}

interface LevelSection {
  levelSlug: string;
  levelTitle: string;
  lessons: Exercise[];
  isLocked: boolean;
}

function mapLevelsToSections(levels: LevelWithProgress[]): LevelSection[] {
  const sections: LevelSection[] = [];
  let yPosition = 100;

  levels.forEach((level, levelIndex) => {
    // Format level title from slug
    const levelTitle = level.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Check if this level is locked (previous level not completed)
    const isLevelLocked = levelIndex > 0 && levels[levelIndex - 1].status !== "completed";

    // Map lessons to exercises
    const lessons: Exercise[] = level.lessons.map((lesson, lessonIndex) => {
      // Find user progress for this lesson
      const userLesson = level.userProgress?.user_lessons.find((ul) => ul.lesson_slug === lesson.slug);
      const isCompleted = userLesson?.status === "completed";

      // Check if previous lesson is completed
      let isLocked = isLevelLocked;
      if (!isLevelLocked && lessonIndex > 0) {
        const prevLessonProgress = level.userProgress?.user_lessons.find(
          (ul) => ul.lesson_slug === level.lessons[lessonIndex - 1].slug
        );
        isLocked = prevLessonProgress?.status !== "completed";
      }

      // Format lesson title from slug
      const title = lesson.slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Zigzag pattern for visual interest
      const xOffset = lessonIndex % 2 === 0 ? -50 : 50;
      const zigzag = Math.sin(lessonIndex * 0.8) * 30;

      return {
        id: `${level.slug}-${lesson.slug}`,
        title,
        type: lesson.type === "video" ? "video" : "coding",
        completed: isCompleted || false,
        locked: isLocked,
        description: lesson.type === "video" ? "Video lesson" : "Interactive exercise",
        estimatedTime: lesson.type === "video" ? 15 : 10,
        difficulty: levelIndex < 2 ? "easy" : levelIndex < 4 ? "medium" : "hard",
        xpReward: 10 + (levelIndex >= 2 ? 5 : 0) + (levelIndex >= 4 ? 5 : 0),
        route: `/lesson/${lesson.slug}`,
        position: {
          x: xOffset + zigzag,
          y: yPosition + lessonIndex * 120
        }
      };
    });

    sections.push({
      levelSlug: level.slug,
      levelTitle,
      lessons,
      isLocked: isLevelLocked
    });

    // Update y position for next level (account for header + lessons)
    yPosition += 80 + lessons.length * 120;
  });

  return sections;
}

export default function ExercisePath({ levels }: ExercisePathProps) {
  const router = useRouter();
  const [clickedLessonId, setClickedLessonId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLessonNavigation = (lessonRoute: string) => {
    // Use React's startTransition for smooth loading state
    startTransition(() => {
      // Navigate with transition
      router.push(lessonRoute);

      // Fire-and-forget pattern: Start tracking in background
      const lessonSlug = lessonRoute.split("/").pop();
      if (lessonSlug) {
        startLesson(lessonSlug).catch((error) => {
          console.error("Failed to start lesson tracking:", error);
        });
      }
    });
  };

  const sections = useMemo(() => {
    if (!levels || levels.length === 0) {
      // Return mock data formatted as sections for development
      const mockExercises = generateMockExercises();
      return [
        {
          levelSlug: "mock",
          levelTitle: "Mock Exercises",
          lessons: mockExercises,
          isLocked: false
        }
      ];
    }
    return mapLevelsToSections(levels);
  }, [levels]);

  // Calculate total height based on sections and their lessons
  const pathHeight = sections.reduce((total, section) => {
    return total + 80 + section.lessons.length * 120;
  }, 200);

  // Flatten all exercises for path connections
  const allExercises = sections.flatMap((section) => section.lessons);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 overflow-y-auto overflow-x-hidden">
      {/* Simplified loading overlay using the new component */}
      <NavigationLoadingOverlay isVisible={isPending} />

      <div className="relative w-full max-w-2xl mx-auto px-8 py-12">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 200 ${pathHeight}`}>
          {allExercises.slice(0, -1).map((exercise, index) => (
            <PathConnection
              key={`path-${exercise.id}`}
              from={exercise.position}
              to={allExercises[index + 1].position}
              completed={exercise.completed}
            />
          ))}
        </svg>

        <div className="relative" style={{ height: `${pathHeight}px` }}>
          {sections.map((section) => (
            <div key={section.levelSlug}>
              {/* Level Header - only show if section has lessons */}
              {section.lessons.length > 0 && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 ${section.isLocked ? "opacity-60" : ""}`}
                  style={{
                    top: `${section.lessons[0].position.y - 60}px`
                  }}
                >
                  <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{section.levelTitle}</h2>
                  <div className="text-sm text-gray-600 text-center">
                    {section.lessons.filter((l) => l.completed).length}/{section.lessons.length} completed
                  </div>
                </div>
              )}

              {/* Lesson Nodes */}
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${lesson.position.x}px)`,
                    top: `${lesson.position.y}px`,
                    transform: "translateX(-50%)"
                  }}
                >
                  <LessonTooltip exercise={lesson} placement="bottom" onNavigate={handleLessonNavigation}>
                    <div
                      className={`transition-all duration-200 ${
                        clickedLessonId === lesson.id ? "scale-95 opacity-75" : ""
                      }`}
                    >
                      <ExerciseNode
                        exercise={lesson}
                        onClick={() => {
                          // Don't navigate on node click if lesson is unlocked
                          // The tooltip will handle navigation
                          if (lesson.locked) {
                            return;
                          }
                          // Just provide visual feedback on node click
                          setClickedLessonId(lesson.id);
                        }}
                      />
                    </div>
                  </LessonTooltip>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
