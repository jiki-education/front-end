"use client";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import type { Lesson, VideoSource } from "@/types/lesson";

type VideoLesson = Lesson & { type: "video" };

// Mock data for the dev page (matching backend structure)
const mockLessonData: VideoLesson = {
  slug: "welcome-to-coding-fundamentals",
  type: "video"
};

const mockVideo: VideoSource = {
  provider: "mux",
  id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU",
  durationSeconds: 120,
  uploadDate: "2026-01-01"
};

export default function VideoExercisePage() {
  return (
    <VideoExercise lessonTitle="Solve the Maze" lessonData={mockLessonData} video={mockVideo} onReady={() => {}} />
  );
}
