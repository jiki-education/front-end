"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserCourse } from "@/types/course";
import type { LessonWithData } from "@/types/lesson";
import type { LastSubmissionData } from "@/lib/api/types/conversation";

const CodingExercise = dynamic(() => import("@/components/coding-exercise/CodingExercise"), { ssr: false });
const VideoExercise = dynamic(() => import("@/components/video-exercise/VideoExercise"), { ssr: false });
const ChooseLanguage = dynamic(() => import("@/components/choose-language/ChooseLanguage"), { ssr: false });

interface LessonContentProps {
  lesson: LessonWithData;
  userCourse: UserCourse | null;
  isCompleted: boolean;
  serverSubmission: LastSubmissionData | null;
  onReady: () => void;
}

export default function LessonContent({
  lesson,
  userCourse,
  isCompleted,
  serverSubmission,
  onReady
}: LessonContentProps) {
  if (lesson.type === "video") {
    return <VideoExercise lessonData={lesson} onReady={onReady} />;
  }

  if (lesson.type === "exercise") {
    return (
      <CodingExercise
        language={userCourse?.language || "javascript"}
        exerciseSlug={lesson.data.slug}
        context={{ type: "lesson", slug: lesson.slug, walkthroughVideoData: lesson.walkthrough_video_data }}
        isCompleted={isCompleted}
        serverSubmission={serverSubmission}
        onReady={onReady}
      />
    );
  }

  if (lesson.type === "choose_language") {
    return <ChooseLanguage lessonData={lesson} onReady={onReady} />;
  }

  // Quiz type - not yet implemented
  return <QuizNotImplemented onReady={onReady} />;
}

function QuizNotImplemented({ onReady }: { onReady: () => void }) {
  const router = useRouter();

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Quiz lessons are not yet implemented</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
