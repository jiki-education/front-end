"use client";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import type { Lesson, VideoSource } from "@/types/lesson";

type VideoLesson = Lesson & { type: "video"; data: { sources: VideoSource[] } };

// Mock data for the dev page (matching backend structure)
const mockLessonData: VideoLesson = {
  slug: "welcome-video",
  type: "video",
  title: "Welcome!",
  description: "Your next lesson",
  walkthrough_video_data: null,
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
