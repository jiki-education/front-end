import { type ProjectData } from "@/lib/api/projects";

export const mockProjects: (ProjectData & {
  progress?: number;
  iconUrl?: string;
  skills?: string;
})[] = [
  {
    slug: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description:
      "Build the classic game with win detection, player turns, and an unbeatable AI using minimax algorithm.",
    status: "started",
    progress: 65,
    iconUrl: "/images/project-icons/icon-tictactoe.png",
    skills: "Logic, AI +3"
  },
  {
    slug: "battleships",
    title: "Battleships",
    description: "Create the strategic naval combat game with grid placement, turn-based gameplay, and AI opponent.",
    status: "unlocked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-battleships.png",
    skills: "Arrays, Loops +8"
  },
  {
    slug: "memory-cards",
    title: "Memory Cards",
    description: "Build a card-matching game with flip animations, match detection, and score tracking.",
    status: "unlocked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-memory.png",
    skills: "Arrays, Events +2"
  },
  {
    slug: "space-invaders",
    title: "Space Invaders",
    description: "Build a classic arcade shooter with enemy waves, player controls, and collision detection.",
    status: "completed",
    progress: 100,
    iconUrl: "/images/project-icons/icon-space-invaders.png",
    skills: "Arrays, Loops +6"
  },
  {
    slug: "snake-game",
    title: "Snake Game",
    description: "Create the addictive classic with growing snake mechanics, food collection, and collision detection.",
    status: "locked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-snake.png",
    skills: "Animation, Loops +4"
  },
  {
    slug: "calculator",
    title: "Calculator",
    description: "Create a functional calculator with basic operations, keyboard support, and a clean interface.",
    status: "locked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-calculator.png",
    skills: "Math, Logic +3"
  },
  {
    slug: "todo-app",
    title: "Todo List App",
    description: "Build a task manager with local storage, filtering, drag-and-drop reordering, and categories.",
    status: "locked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-todo.png",
    skills: "Storage, Events +5"
  },
  {
    slug: "weather-app",
    title: "Weather App",
    description:
      "Create a weather dashboard with API integration, location search, and 5-day forecasts with animations.",
    status: "locked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-weather.png",
    skills: "APIs, Async +10"
  },
  {
    slug: "chat-app",
    title: "Real-time Chat",
    description: "Build a messaging app with WebSocket connections, user authentication, and chat rooms.",
    status: "locked",
    progress: 0,
    iconUrl: "/images/project-icons/icon-chat.png",
    skills: "WebSocket, Auth +13"
  }
];
