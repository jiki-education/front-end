export interface StatusOption {
  emoji: string;
  text: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  countryFlag: string;
  currentStatus: StatusOption;
  streak: {
    count: number;
    unit: string;
  };
  stats: {
    skillsLearned: number;
    cohort: string;
  };
  quickStats: {
    completedExercises: number;
    badges: number;
  };
  badges: Badge[];
}

export interface Badge {
  id: string;
  image: string;
  alt: string;
  isNew?: boolean;
  variant?: "new" | "purple" | "default";
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  progress: number;
  status: "in-progress" | "not-started" | "completed";
}

export interface GlobalActivity {
  codingNow: number;
  thisWeek: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { emoji: "🔥", text: "Feeling motivated, let's go!" },
  { emoji: "⏰", text: "Long session time! (60+ mins)" },
  { emoji: "⚡", text: "Just a quicky (20 mins)" },
  { emoji: "❤️", text: "I LOVE CODE TODAY!" },
  { emoji: "🥱", text: "Just showing up today" }
];

export function getMockUserProfile(): UserProfile {
  return {
    name: "Nic",
    handle: "japermian",
    avatar: "/static/images/avatars/nicole.png",
    countryFlag: "🇩🇪",
    currentStatus: { emoji: "🔥", text: "Feeling motivated, let's go!" },
    streak: {
      count: 7,
      unit: "Day Streak"
    },
    stats: {
      skillsLearned: 8,
      cohort: "Jan 2025"
    },
    quickStats: {
      completedExercises: 4,
      badges: 12
    },
    badges: [
      {
        id: "1",
        image: "static/images/achievement-icons/About-Us-1--Streamline-Manila.png",
        alt: "First Achievement Badge",
        isNew: true,
        variant: "new"
      },
      {
        id: "2",
        image: "static/images/achievement-icons/About-Us-2--Streamline-Manila.png",
        alt: "Second Achievement Badge",
        variant: "purple"
      },
      {
        id: "3",
        image: "static/images/achievement-icons/Approval--Streamline-Manila.png",
        alt: "Approval Badge",
        variant: "purple"
      },
      {
        id: "4",
        image: "static/images/achievement-icons/About-Us-1--Streamline-Manila.png",
        alt: "First Achievement Badge",
        isNew: true,
        variant: "new"
      },
      {
        id: "5",
        image: "static/images/achievement-icons/About-Us-2--Streamline-Manila.png",
        alt: "Second Achievement Badge",
        variant: "purple"
      },
      {
        id: "6",
        image: "static/images/achievement-icons/Approval--Streamline-Manila.png",
        alt: "Approval Badge",
        variant: "purple"
      }
    ]
  };
}

export function getMockProjects(): { projects: Project[]; unlockedCount: number } {
  return {
    unlockedCount: 4,
    projects: [
      {
        id: "snake",
        name: "Snake",
        icon: "/static/images/projects/snake.png",
        progress: 45,
        status: "in-progress"
      },
      {
        id: "tictactoe",
        name: "Tic-Tac-Toe",
        icon: "/static/images/projects/tictactoe.png",
        progress: 20,
        status: "in-progress"
      },
      {
        id: "calculator",
        name: "Calculator",
        icon: "/static/images/projects/generic.png",
        progress: 0,
        status: "not-started"
      }
    ]
  };
}

export function getMockBadges(): { badges: Badge[]; earnedCount: number } {
  return {
    earnedCount: 12,
    badges: [
      {
        id: "new-badge",
        image: "/static/images/achievement-icons/About-Us-2--Streamline-Manila.png",
        alt: "New Badge",
        isNew: true,
        variant: "new"
      },
      {
        id: "first-badge",
        image: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png",
        alt: "First Badge",
        variant: "default"
      },
      {
        id: "analyze-badge",
        image: "/static/images/achievement-icons/Analyze-Data--Streamline-Manila.png",
        alt: "Third Badge",
        variant: "default"
      },
      {
        id: "analyze-badge-2",
        image: "/static/images/achievement-icons/Analyze-Data-2--Streamline-Manila.png",
        alt: "Fourth Badge",
        variant: "default"
      }
    ]
  };
}

export function getMockGlobalActivity(): GlobalActivity {
  return {
    codingNow: 14327,
    thisWeek: "19.4M"
  };
}
