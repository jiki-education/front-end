import { LessonTooltip } from "@/components/dashboard/exercise-path/LessonTooltip";
import type { Exercise } from "@/components/dashboard/lib/mockData";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Mock next/link
jest.mock("next/link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href, onClick, className }: any) => {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  };
});

// Mock floating-ui FloatingPortal to render inline for testing
jest.mock("@floating-ui/react", () => ({
  ...jest.requireActual("@floating-ui/react"),
  FloatingPortal: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe("LessonTooltip", () => {
  const mockExercise: Exercise = {
    id: "1",
    title: "Introduction to Variables",
    description: "Learn about variables and data types",
    type: "coding",
    difficulty: "easy",
    estimatedTime: 10,
    xpReward: 100,
    route: "/exercises/intro-variables",
    completed: false,
    locked: false,
    position: { x: 0, y: 0 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children element without tooltip initially", () => {
    render(
      <LessonTooltip exercise={mockExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows tooltip when clicking on the trigger element", async () => {
    const user = userEvent.setup();

    render(
      <LessonTooltip exercise={mockExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Introduction to Variables")).toBeInTheDocument();
      expect(screen.getByText("Learn about variables and data types")).toBeInTheDocument();
    });
  });

  it("displays exercise information correctly in tooltip", async () => {
    const user = userEvent.setup();

    render(
      <LessonTooltip exercise={mockExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    await waitFor(() => {
      // Check title and description
      expect(screen.getByText("Introduction to Variables")).toBeInTheDocument();
      expect(screen.getByText("Learn about variables and data types")).toBeInTheDocument();

      // Check metadata
      expect(screen.getByText("10 min")).toBeInTheDocument();
      expect(screen.getByText("100 XP")).toBeInTheDocument();
      expect(screen.getByText("Easy")).toBeInTheDocument();
      expect(screen.getByText("Exercise")).toBeInTheDocument();

      // Check start link
      expect(screen.getByRole("link", { name: "Start Lesson" })).toBeInTheDocument();
    });
  });

  it("shows correct icon for different exercise types", async () => {
    const user = userEvent.setup();

    const videoExercise: Exercise = {
      ...mockExercise,
      type: "video"
    };

    const { rerender } = render(
      <LessonTooltip exercise={videoExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Video Lesson")).toBeInTheDocument();
    });

    // Test quiz type
    const quizExercise: Exercise = {
      ...mockExercise,
      type: "quiz"
    };

    rerender(
      <LessonTooltip exercise={quizExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    await waitFor(() => {
      expect(screen.getByText("Quiz")).toBeInTheDocument();
    });
  });

  it("displays correct difficulty styling", async () => {
    const user = userEvent.setup();

    const mediumExercise: Exercise = {
      ...mockExercise,
      difficulty: "medium"
    };

    const { rerender } = render(
      <LessonTooltip exercise={mediumExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    await waitFor(() => {
      const difficultyBadge = screen.getByText("Medium");
      expect(difficultyBadge).toHaveClass("bg-yellow-100", "text-yellow-700");
    });

    // Test hard difficulty
    const hardExercise: Exercise = {
      ...mockExercise,
      difficulty: "hard"
    };

    rerender(
      <LessonTooltip exercise={hardExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    await waitFor(() => {
      const difficultyBadge = screen.getByText("Hard");
      expect(difficultyBadge).toHaveClass("bg-red-100", "text-red-700");
    });
  });

  it("shows completed status and changes button text", async () => {
    const user = userEvent.setup();

    const completedExercise: Exercise = {
      ...mockExercise,
      completed: true
    };

    render(
      <LessonTooltip exercise={completedExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Review Lesson" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Start Lesson" })).not.toBeInTheDocument();
    });
  });

  it("does not show tooltip for locked exercises", async () => {
    const user = userEvent.setup();

    const lockedExercise: Exercise = {
      ...mockExercise,
      locked: true
    };

    render(
      <LessonTooltip exercise={lockedExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    // Wait a bit to ensure tooltip doesn't appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates to exercise route when start link is clicked", async () => {
    const user = userEvent.setup();

    render(
      <LessonTooltip exercise={mockExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const triggerButton = screen.getByRole("button", { name: "Click me" });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const startLink = screen.getByRole("link", { name: "Start Lesson" });
    expect(startLink).toHaveAttribute("href", "/exercises/intro-variables");

    await user.click(startLink);

    // Tooltip should close after navigation
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes tooltip when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <LessonTooltip exercise={mockExercise}>
          <button>Click me</button>
        </LessonTooltip>
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Click outside
    const outsideElement = screen.getByTestId("outside");
    await user.click(outsideElement);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("accepts custom placement prop", () => {
    render(
      <LessonTooltip exercise={mockExercise} placement="top" offset={20}>
        <button>Click me</button>
      </LessonTooltip>
    );

    // This test mainly ensures the component accepts these props without errors
    // The actual positioning would be handled by floating-ui
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("clones child element with ref for positioning", async () => {
    const user = userEvent.setup();

    render(
      <LessonTooltip exercise={mockExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    // The tooltip should clone the child and add necessary props
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();

    // Click to open tooltip and verify it's attached to the button
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("returns null for invalid children", () => {
    const { container } = render(
      <LessonTooltip exercise={mockExercise}>
        {/* @ts-ignore - testing invalid children */}
        {"Invalid string child"}
      </LessonTooltip>
    );

    expect(container.firstChild).toBeNull();
  });

  it("toggles tooltip on repeated clicks", async () => {
    const user = userEvent.setup();

    render(
      <LessonTooltip exercise={mockExercise}>
        <button>Click me</button>
      </LessonTooltip>
    );

    const button = screen.getByRole("button", { name: "Click me" });

    // First click - open
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Second click - close
    await user.click(button);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Third click - open again
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
