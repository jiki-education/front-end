"use client";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import type { LessonData } from "@/lib/api/lessons";

// Mock data for the dev page (matching backend structure)
const mockLessonData: LessonData = {
  slug: "welcome-video",
  type: "video",
  title: "Welcome!",
  description: "Your next lesson",
  data: {
    sources: [
      {
        host: "mux",
        id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU"
      }
    ]
  }
};

export default function VideoExercisePage() {
  return <VideoExercise lessonData={mockLessonData} />;
}
