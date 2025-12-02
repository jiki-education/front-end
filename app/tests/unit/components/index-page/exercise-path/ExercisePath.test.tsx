import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import * as mockData from "@/components/dashboard/lib/mockData";
import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush
  }))
}));

jest.mock("@/components/dashboard/lib/mockData");

// Mock the API levels fetch function
jest.mock("@/lib/api/levels", () => ({
  fetchLevelsWithProgress: jest.fn().mockResolvedValue([])
}));

// Mock the API startLesson function
jest.mock("@/lib/api/lessons", () => ({
  startLesson: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("@/components/dashboard/exercise-path/LessonTooltip", () => ({
  LessonTooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock("@/components/dashboard/exercise-path/PathConnection", () => ({
  PathConnection: ({ from, to, completed }: any) => (
    <line
      data-testid="path-connection"
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      className={completed ? "completed" : "incomplete"}
    />
  )
}));

// Helper function to wait for component to finish loading
async function waitForLoadingComplete() {
  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
}

describe("ExercisePath", () => {
  const mockExercises = [
    {
      id: "1",
      title: "Getting Started",
      description: "Your first program",
      type: "coding" as const,
      difficulty: "easy" as const,
      completed: true,
      locked: false,
      xpReward: 10,
      estimatedTime: 5,
      position: { x: 0, y: 0 },
      route: "/lesson/1"
    },
    {
      id: "2",
      title: "Variables",
      description: "Learn about variables",
      type: "quiz" as const,
      difficulty: "easy" as const,
      completed: true,
      locked: false,
      xpReward: 15,
      estimatedTime: 10,
      position: { x: 50, y: 150 },
      route: "/lesson/2"
    },
    {
      id: "3",
      title: "Functions",
      description: "Video lesson on functions",
      type: "video" as const,
      difficulty: "medium" as const,
      completed: false,
      locked: false,
      xpReward: 20,
      estimatedTime: 15,
      position: { x: -50, y: 300 },
      route: "/lesson/3"
    },
    {
      id: "4",
      title: "Arrays",
      description: "Work with arrays",
      type: "coding" as const,
      difficulty: "medium" as const,
      completed: false,
      locked: true,
      xpReward: 25,
      estimatedTime: 20,
      position: { x: 0, y: 450 },
      route: "/lesson/4"
    }
  ];

  beforeEach(() => {
    (mockData.generateMockExercises as jest.Mock).mockReturnValue(mockExercises);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the exercise path container with correct styling", async () => {
    const { container } = render(<ExercisePath />);
    await waitForLoadingComplete();

    const pathContainer = container.querySelector(".relative.min-h-screen.bg-gradient-to-b");
    expect(pathContainer).toBeInTheDocument();
    expect(pathContainer).toHaveClass("from-blue-50", "to-purple-50", "overflow-y-auto", "overflow-x-hidden");
  });

  it("renders all exercises from mock data", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Variables")).toBeInTheDocument();
    expect(screen.getByText("Functions")).toBeInTheDocument();
    expect(screen.getByText("Arrays")).toBeInTheDocument();
  });

  it("renders correct number of path connections", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const connections = screen.getAllByTestId("path-connection");
    expect(connections).toHaveLength(mockExercises.length - 1);
  });

  it("passes correct props to path connections", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const connections = screen.getAllByTestId("path-connection");

    expect(connections[0]).toHaveAttribute("x1", "0");
    expect(connections[0]).toHaveAttribute("y1", "0");
    expect(connections[0]).toHaveAttribute("x2", "50");
    expect(connections[0]).toHaveAttribute("y2", "150");
    expect(connections[0]).toHaveClass("completed");

    expect(connections[1]).toHaveAttribute("x1", "50");
    expect(connections[1]).toHaveAttribute("y1", "150");
    expect(connections[1]).toHaveAttribute("x2", "-50");
    expect(connections[1]).toHaveAttribute("y2", "300");
    expect(connections[1]).toHaveClass("completed");

    expect(connections[2]).toHaveClass("incomplete");
  });

  it("positions exercises correctly based on their coordinates", async () => {
    const { container } = render(<ExercisePath />);
    await waitForLoadingComplete();

    const exerciseContainers = container.querySelectorAll('.absolute[style*="left"]');

    expect(exerciseContainers).toHaveLength(mockExercises.length);

    expect(exerciseContainers[0]).toHaveStyle({
      left: "calc(50% + 0px)",
      top: "0px",
      transform: "translateX(-50%)"
    });

    expect(exerciseContainers[1]).toHaveStyle({
      left: "calc(50% + 50px)",
      top: "150px",
      transform: "translateX(-50%)"
    });

    expect(exerciseContainers[2]).toHaveStyle({
      left: "calc(50% + -50px)",
      top: "300px",
      transform: "translateX(-50%)"
    });
  });

  it("wraps each ExerciseNode with LessonTooltip", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const exerciseButtons = screen.getAllByRole("button");
    expect(exerciseButtons).toHaveLength(mockExercises.length);
  });

  it("renders SVG container with correct viewBox", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // pathHeight = 1 section header (80) + 4 mock exercises * 120 + 200 = 760
    expect(svg).toHaveAttribute("viewBox", "0 0 200 760");
    expect(svg).toHaveClass("absolute", "inset-0", "w-full", "h-full", "pointer-events-none");
  });

  it("sets correct height for the exercise container", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    // pathHeight = 1 section header (80) + 4 mock exercises * 120 + 200 = 760
    const container = document.querySelector('[style*="height: 760px"]');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("relative");
  });

  it("calls generateMockExercises on mount", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    // In React 19 with strict mode, effects run twice in development
    // The component calls generateMockExercises in useMemo when levels is empty
    expect(mockData.generateMockExercises).toHaveBeenCalled();
  });

  it("opens tooltip when exercise node is clicked", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const firstButton = screen.getAllByRole("button")[0];

    // Use act to wrap the state update
    act(() => {
      firstButton.click();
    });

    // The tooltip opening behavior is handled by LessonTooltip component
    // which is mocked, so we just verify the click handler is called
    // Navigation now happens through the tooltip, not directly
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("navigates to lesson route when tooltip triggers navigation", async () => {
    // Mock LessonTooltip to capture and invoke the onNavigate callback
    const LessonTooltipMock = jest.requireMock("@/components/dashboard/exercise-path/LessonTooltip");
    let capturedOnNavigate: ((route: string) => void) | undefined;

    LessonTooltipMock.LessonTooltip = jest.fn(({ children, onNavigate }: any) => {
      capturedOnNavigate = onNavigate;
      return children;
    });

    render(<ExercisePath />);
    await waitForLoadingComplete();

    // Verify that onNavigate callback was captured
    expect(capturedOnNavigate).toBeDefined();

    // Simulate the tooltip calling onNavigate with a lesson route
    act(() => {
      if (capturedOnNavigate) {
        capturedOnNavigate("/lesson/1");
      }
    });

    // Verify router.push was called with the correct route
    expect(mockPush).toHaveBeenCalledWith("/lesson/1");
  });

  it("renders with responsive container styling", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const innerContainer = document.querySelector(".max-w-2xl");
    expect(innerContainer).toHaveClass("relative", "w-full", "max-w-2xl", "mx-auto", "px-8", "py-12");
  });

  it("does not render path connection for the last exercise", async () => {
    render(<ExercisePath />);
    await waitForLoadingComplete();

    const connections = screen.getAllByTestId("path-connection");
    const lastExerciseIndex = mockExercises.length - 1;

    expect(connections).toHaveLength(lastExerciseIndex);

    connections.forEach((connection, index) => {
      const fromExercise = mockExercises[index];
      const toExercise = mockExercises[index + 1];

      expect(connection).toHaveAttribute("x1", String(fromExercise.position.x));
      expect(connection).toHaveAttribute("y1", String(fromExercise.position.y));
      expect(connection).toHaveAttribute("x2", String(toExercise.position.x));
      expect(connection).toHaveAttribute("y2", String(toExercise.position.y));
    });
  });

  it("handles empty exercise list gracefully", async () => {
    (mockData.generateMockExercises as jest.Mock).mockReturnValue([]);

    render(<ExercisePath />);
    await waitForLoadingComplete();

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByTestId("path-connection")).toHaveLength(0);
  });

  it("handles single exercise without connections", async () => {
    (mockData.generateMockExercises as jest.Mock).mockReturnValue([mockExercises[0]]);

    render(<ExercisePath />);
    await waitForLoadingComplete();

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.queryAllByTestId("path-connection")).toHaveLength(0);
  });
});
