"use client";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import type { Lesson, VideoSource } from "@/types/lesson";

type VideoLesson = Lesson & { type: "video"; data: { sources: VideoSource[] } };

// Mock data for the dev page (matching backend structure)
const mockLessonData: VideoLesson = {
  slug: "welcome-video",
  type: "video",
  walkthrough_video_data: null,
  data: {
    sources: [
      {
        provider: "mux",
        id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU",
        durationSeconds: 120,
        uploadDate: "2026-01-01"
      }
    ]
  }
};

export default function VideoExercisePage() {
  return <VideoExercise lessonTitle="Solve the Maze" lessonData={mockLessonData} onReady={() => {}} />;
}
