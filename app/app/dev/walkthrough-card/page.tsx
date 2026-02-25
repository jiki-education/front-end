"use client";

import { WalkthroughCard } from "@/components/dashboard/exercise-path/ui/WalkthroughCard";
import type { LessonDisplayData } from "@/components/dashboard/exercise-path/types";

function createLesson(overrides: Partial<LessonDisplayData> = {}): LessonDisplayData {
  return {
    lesson: {
      slug: "test-lesson",
      title: "Test Lesson",
      description: "A test lesson",
      type: "exercise",
      walkthrough_video_data: [{ provider: "mux", id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU" }]
    },
    completed: false,
    locked: false,
    route: "/lesson/test",
    walkthroughVideoWatchedPercentage: 0,
    ...overrides
  };
}

const lockedLesson = createLesson({ locked: true, completed: false });
const unwatchedLesson = createLesson({ completed: true, walkthroughVideoWatchedPercentage: 0 });
const watchingLesson = createLesson({ completed: true, walkthroughVideoWatchedPercentage: 50 });
const watchedLesson = createLesson({ completed: true, walkthroughVideoWatchedPercentage: 100 });

export default function WalkthroughCardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">WalkthroughCard States</h1>

        <div className="space-y-12">
          {[
            { label: "Locked (exercise not completed)", lesson: lockedLesson },
            { label: "Unwatched - 0% (blue)", lesson: unwatchedLesson },
            { label: "Watching - 50% (purple)", lesson: watchingLesson },
            { label: "Watched - 100% (green)", lesson: watchedLesson }
          ].map(({ label, lesson }) => (
            <div key={label}>
              <h2 className="text-lg font-semibold mb-3">{label}</h2>
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 relative" style={{ minHeight: 120 }}>
                <span className="text-gray-500">Lesson card content</span>
                <WalkthroughCard lesson={lesson} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
