"use client";

import { startLesson } from "@/lib/api/lessons";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import type { LevelWithProgress } from "@/types/levels";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { type Exercise, generateMockExercises } from "../lib/mockData";
import NavigationLoadingOverlay from "@/components/common/NavigationLoadingOverlay";
import { ExerciseNode } from "./ExerciseNode";
import { LessonTooltip } from "./LessonTooltip";
import { PathConnection } from "./PathConnection";
import { MilestoneButton } from "./ui/MilestoneButton";
import { showModal } from "@/lib/modal";
import { completeLevelMilestone } from "@/lib/api/levels";

interface LevelSection {
  levelSlug: string;
  levelTitle: string;
  lessons: Exercise[];
  isLocked: boolean;
  milestoneStatus: "not_ready" | "ready_for_completion" | "completed";
  completedLessonsCount: number;
  xpEarned: number;
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

    // Calculate milestone status
    const completedLessonsCount = lessons.filter((l) => l.completed).length;
    const allLessonsCompleted = completedLessonsCount === lessons.length;
    const isLevelCompleted = level.userProgress?.completed_at != null;
    
    let milestoneStatus: "not_ready" | "ready_for_completion" | "completed" = "not_ready";
    if (isLevelCompleted) {
      milestoneStatus = "completed";
    } else if (allLessonsCompleted && !isLevelLocked) {
      milestoneStatus = "ready_for_completion";
    }

    // Calculate XP earned from this level
    const xpEarned = lessons.reduce((total, lesson) => total + (lesson.completed ? lesson.xpReward : 0), 0);

    sections.push({
      levelSlug: level.slug,
      levelTitle,
      lessons,
      isLocked: isLevelLocked,
      milestoneStatus,
      completedLessonsCount,
      xpEarned
    });

    // Update y position for next level (account for header + lessons + potential milestone button)
    const milestoneButtonSpace = milestoneStatus === "ready_for_completion" ? 100 : 0;
    yPosition += 80 + lessons.length * 120 + milestoneButtonSpace;
  });

  return sections;
}

export default function ExercisePath() {
  const router = useRouter();
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [clickedLessonId, setClickedLessonId] = useState<string | null>(null);
  const [levelCompletionInProgress, setLevelCompletionInProgress] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load levels on mount
  useEffect(() => {
    async function loadLevels() {
      try {
        setLevelsLoading(true);
        const data = await fetchLevelsWithProgress();
        setLevels(data);
      } catch (error) {
        console.error("Failed to fetch levels:", error);
        // Auth/network/rate-limit errors never reach here (handled globally)
        // Only application errors (404, 500, validation) reach this catch block
        setLevelsError(error instanceof Error ? error.message : "Failed to load levels");
      } finally {
        setLevelsLoading(false);
      }
    }

    void loadLevels();
  }, []);

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

  const handleMilestoneClick = (section: LevelSection) => {
    if (section.milestoneStatus !== "ready_for_completion" || levelCompletionInProgress) {
      return;
    }

    setLevelCompletionInProgress(section.levelSlug);

    try {
      // Show level milestone modal
      showModal("level-milestone-modal", {
        levelTitle: section.levelTitle,
        completedLessonsCount: section.completedLessonsCount,
        totalLessonsCount: section.lessons.length,
        xpEarned: section.xpEarned,
        onContinue: async () => {
          try {
            // Call the API to complete the level milestone
            await completeLevelMilestone(section.levelSlug);
            
            // Refresh the levels data to show the updated state
            const updatedLevels = await fetchLevelsWithProgress();
            setLevels(updatedLevels);
            
            // Level completion successful - state is updated via setLevels
          } catch (error) {
            console.error("Failed to complete level milestone:", error);
            // TODO: Show error toast
          } finally {
            setLevelCompletionInProgress(null);
          }
        },
        onGoToDashboard: () => {
          setLevelCompletionInProgress(null);
          // Already on dashboard, just close modal
        }
      });
    } catch (error) {
      console.error("Failed to show milestone modal:", error);
      setLevelCompletionInProgress(null);
    }
  };

  const sections = useMemo(() => {
    if (levels.length === 0) {
      // Return mock data formatted as sections for development
      const mockExercises = generateMockExercises();
      const completedLessonsCount = mockExercises.filter(e => e.completed).length;
      return [
        {
          levelSlug: "mock",
          levelTitle: "Mock Exercises",
          lessons: mockExercises,
          isLocked: false,
          milestoneStatus: completedLessonsCount === mockExercises.length ? "ready_for_completion" : "not_ready",
          completedLessonsCount,
          xpEarned: mockExercises.reduce((total, lesson) => total + (lesson.completed ? lesson.xpReward : 0), 0)
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

  if (levelsLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (levelsError) {
    const handleClearSession = () => {
      // Clear all auth data
      sessionStorage.clear();
      localStorage.clear();
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Redirect to login
      window.location.href = "/auth/login";
    };

    return (
      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error-text mb-4">Error: {levelsError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring"
            >
              Retry
            </button>
            <button
              onClick={handleClearSession}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-90 transition-opacity focus-ring"
            >
              Clear Session
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              
              {/* Milestone Button - show when level is ready for completion */}
              {section.milestoneStatus === "ready_for_completion" && section.lessons.length > 0 && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2"
                  style={{
                    top: `${section.lessons[section.lessons.length - 1].position.y + 80}px`
                  }}
                >
                  <MilestoneButton
                    levelTitle={section.levelTitle}
                    onClick={() => handleMilestoneClick(section)}
                    disabled={levelCompletionInProgress === section.levelSlug}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
