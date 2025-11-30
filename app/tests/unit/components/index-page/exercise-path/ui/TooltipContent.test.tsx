import { TooltipContent } from "@/components/dashboard/exercise-path/ui/TooltipContent";
import type { Exercise } from "@/components/dashboard/lib/mockData";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({ children, href, onClick }: any) => (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    )
  };
});

describe("TooltipContent", () => {
  const mockOnClose = jest.fn();
  const mockOnNavigate = jest.fn();

  const mockExercise: Exercise = {
    id: "test-1",
    title: "Test Exercise",
    type: "coding",
    completed: false,
    locked: false,
    description: "Test description",
    estimatedTime: 10,
    difficulty: "easy",
    xpReward: 20,
    route: "/lesson/test-exercise",
    position: { x: 0, y: 0 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders exercise information correctly", () => {
    render(<TooltipContent exercise={mockExercise} onClose={mockOnClose} />);

    expect(screen.getByText("Test Exercise")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("10 min")).toBeInTheDocument();
    expect(screen.getByText("20 XP")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });

  it("shows 'Start Lesson' button for incomplete exercises", () => {
    render(<TooltipContent exercise={mockExercise} onClose={mockOnClose} />);

    const button = screen.getByText("Start Lesson");
    expect(button).toBeInTheDocument();
  });

  it("shows 'Review Lesson' button for completed exercises", () => {
    const completedExercise = { ...mockExercise, completed: true };

    render(<TooltipContent exercise={completedExercise} onClose={mockOnClose} />);

    const button = screen.getByText("Review Lesson");
    expect(button).toBeInTheDocument();
  });

  it("displays completed badge when exercise is completed", () => {
    const completedExercise = { ...mockExercise, completed: true };

    render(<TooltipContent exercise={completedExercise} onClose={mockOnClose} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("calls onClose and onNavigate when lesson button is clicked", () => {
    render(<TooltipContent exercise={mockExercise} onClose={mockOnClose} onNavigate={mockOnNavigate} />);

    const button = screen.getByText("Start Lesson");
    fireEvent.click(button);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    expect(mockOnNavigate).toHaveBeenCalledWith("/lesson/test-exercise");
  });

  it("prevents default link navigation when onNavigate is provided", () => {
    render(<TooltipContent exercise={mockExercise} onClose={mockOnClose} onNavigate={mockOnNavigate} />);

    const link = screen.getByRole("link");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });

    Object.defineProperty(event, "preventDefault", {
      value: jest.fn(),
      writable: false
    });

    fireEvent(link, event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("only calls onClose when onNavigate is not provided", () => {
    render(<TooltipContent exercise={mockExercise} onClose={mockOnClose} />);

    const button = screen.getByText("Start Lesson");
    fireEvent.click(button);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it("renders video icon for video type", () => {
    const videoExercise = { ...mockExercise, type: "video" as const };

    render(<TooltipContent exercise={videoExercise} onClose={mockOnClose} />);

    expect(screen.getByText("Video Lesson")).toBeInTheDocument();
    // Check for video icon SVG
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it("renders quiz icon for quiz type", () => {
    const quizExercise = { ...mockExercise, type: "quiz" as const };

    render(<TooltipContent exercise={quizExercise} onClose={mockOnClose} />);

    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });

  it("applies correct difficulty styling for medium difficulty", () => {
    const mediumExercise = { ...mockExercise, difficulty: "medium" as const };

    render(<TooltipContent exercise={mediumExercise} onClose={mockOnClose} />);

    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("applies correct difficulty styling for hard difficulty", () => {
    const hardExercise = { ...mockExercise, difficulty: "hard" as const };

    render(<TooltipContent exercise={hardExercise} onClose={mockOnClose} />);

    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("uses headingId and descriptionId when provided", () => {
    render(
      <TooltipContent
        exercise={mockExercise}
        onClose={mockOnClose}
        headingId="test-heading"
        descriptionId="test-description"
      />
    );

    expect(screen.getByText("Test Exercise")).toHaveAttribute("id", "test-heading");
    expect(screen.getByText("Test description")).toHaveAttribute("id", "test-description");
  });
});
