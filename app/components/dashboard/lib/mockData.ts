export type ExerciseType = "quiz" | "video" | "coding";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  locked: boolean;
  xpReward: number;
  estimatedTime: number;
  position: { x: number; y: number };
  route: string;
}

export function generateMockExercises(): Exercise[] {
  const exercises: Exercise[] = [
    {
      id: "1",
      title: "Getting Started with Python",
      description: "Your first program",
      type: "coding",
      difficulty: "easy",
      completed: true,
      locked: false,
      xpReward: 10,
      estimatedTime: 5,
      position: { x: 0, y: 0 },
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
      position: { x: 0, y: 150 },
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
      position: { x: -100, y: 300 },
      route: "/dev/video-exercise"
    },
    {
      id: "4",
      title: "Working with Lists",
      description: "Work with collections",
      type: "coding",
      difficulty: "medium",
      completed: false,
      locked: false,
      xpReward: 25,
      estimatedTime: 20,
      position: { x: 100, y: 300 },
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
      position: { x: 0, y: 450 },
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
      position: { x: -100, y: 600 },
      route: "/dev/video-exercise"
    },
    {
      id: "7",
      title: "Design Patterns Workshop",
      description: "Object-oriented programming",
      type: "coding",
      difficulty: "hard",
      completed: false,
      locked: true,
      xpReward: 40,
      estimatedTime: 30,
      position: { x: 100, y: 600 },
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
      position: { x: 0, y: 750 },
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
      position: { x: -100, y: 900 },
      route: "/test/quiz"
    },
    {
      id: "10",
      title: "Build a Web Application",
      description: "Build something amazing",
      type: "coding",
      difficulty: "hard",
      completed: false,
      locked: true,
      xpReward: 100,
      estimatedTime: 60,
      position: { x: 0, y: 1050 },
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
