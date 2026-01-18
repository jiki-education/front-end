import type { LessonType } from "@/types/lesson";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  locked: boolean;
  xpReward: number;
  estimatedTime: number;
  route: string;
}

export function generateMockExercises(): Exercise[] {
  const exercises: Exercise[] = [
    {
      id: "1",
      title: "Getting Started with Python",
      description: "Your first program",
      type: "exercise",
      difficulty: "easy",
      completed: true,
      locked: false,
      xpReward: 10,
      estimatedTime: 5,
      route: "/dev/coding-exercise"
    },
    {
      id: "2",
      title: "Data Types Fundamentals",
      description: "Learn about variables",
      type: "quiz",
      difficulty: "easy",
      completed: true,
      locked: false,
      xpReward: 15,
      estimatedTime: 10,
      route: "/test/quiz"
    },
    {
      id: "3",
      title: "Building Your First Function",
      description: "Video lesson on functions",
      type: "video",
      difficulty: "easy",
      completed: false,
      locked: false,
      xpReward: 20,
      estimatedTime: 15,
      route: "/dev/video-exercise"
    },
    {
      id: "4",
      title: "Working with Lists",
      description: "Work with collections",
      type: "exercise",
      difficulty: "medium",
      completed: false,
      locked: false,
      xpReward: 25,
      estimatedTime: 20,
      route: "/dev/coding-exercise"
    },
    {
      id: "5",
      title: "Control Flow Mastery",
      description: "Test your knowledge",
      type: "quiz",
      difficulty: "medium",
      completed: false,
      locked: true,
      xpReward: 30,
      estimatedTime: 20,
      route: "/test/quiz"
    },
    {
      id: "6",
      title: "Object-Oriented Concepts",
      description: "Video: Complex data structures",
      type: "video",
      difficulty: "medium",
      completed: false,
      locked: true,
      xpReward: 35,
      estimatedTime: 25,
      route: "/dev/video-exercise"
    },
    {
      id: "7",
      title: "Design Patterns Workshop",
      description: "Object-oriented programming",
      type: "exercise",
      difficulty: "hard",
      completed: false,
      locked: true,
      xpReward: 40,
      estimatedTime: 30,
      route: "/dev/coding-exercise"
    },
    {
      id: "8",
      title: "Asynchronous Programming",
      description: "Video: Asynchronous operations",
      type: "video",
      difficulty: "hard",
      completed: false,
      locked: true,
      xpReward: 45,
      estimatedTime: 35,
      route: "/dev/video-exercise"
    },
    {
      id: "9",
      title: "Exception Management",
      description: "Test error handling knowledge",
      type: "quiz",
      difficulty: "hard",
      completed: false,
      locked: true,
      xpReward: 50,
      estimatedTime: 30,
      route: "/test/quiz"
    },
    {
      id: "10",
      title: "Build a Web Application",
      description: "Build something amazing",
      type: "exercise",
      difficulty: "hard",
      completed: false,
      locked: true,
      xpReward: 100,
      estimatedTime: 60,
      route: "/dev/coding-exercise"
    }
  ];

  return exercises;
}

export interface UserProgress {
  currentLevel: number;
  totalXp: number;
  streak: number;
  completedExercises: number;
  totalExercises: number;
}

export function getMockUserProgress(): UserProgress {
  return {
    currentLevel: 3,
    totalXp: 25,
    streak: 5,
    completedExercises: 2,
    totalExercises: 10
  };
}
