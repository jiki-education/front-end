"use client";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import type { LessonData } from "@/lib/api/lessons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev: Video Exercise - Jiki",
  description: "Development page for testing the video exercise component."
};

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
