import type { LessonData } from "@/components/dashboard/exercise-path/types";
import { LessonNode } from "@/components/dashboard/exercise-path/ui/LessonNode";
import { fireEvent, render, screen } from "@testing-library/react";

function createMockLesson(overrides?: Partial<LessonData>): LessonData {
  return {
    id: "1",
    slug: "test-lesson",
    title: "Test Lesson",
    description: "Test description",
    type: "coding",
    completed: false,
    locked: false,
    route: "/test",
    position: { x: 0, y: 0 },
    ...overrides
  };
}

describe("LessonNode", () => {
  it("renders lesson title and description", () => {
    const lesson = createMockLesson({
      title: "Python Basics",
      description: "Learn the basics"
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("Python Basics")).toBeInTheDocument();
    expect(screen.getByText("Learn the basics")).toBeInTheDocument();
  });

  it("displays correct label for different lesson types", () => {
    const { rerender } = render(<LessonNode lesson={createMockLesson({ type: "coding" })} />);
    expect(screen.getByText("Exercise")).toBeInTheDocument();

    rerender(<LessonNode lesson={createMockLesson({ type: "video" })} />);
    expect(screen.getByText("Video")).toBeInTheDocument();

    rerender(<LessonNode lesson={createMockLesson({ type: "quiz" })} />);
    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });

  it("displays correct status for incomplete unlocked lesson", () => {
    const lesson = createMockLesson({
      completed: false,
      locked: false
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("displays correct status for completed lesson", () => {
    const lesson = createMockLesson({
      completed: true,
      locked: false
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("displays correct status for locked lesson", () => {
    const lesson = createMockLesson({
      completed: false,
      locked: true
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("Locked")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = jest.fn();
    const lesson = createMockLesson({ locked: false });

    render(<LessonNode lesson={lesson} onClick={onClick} />);

    const node = screen.getByText("Test Lesson").closest("div[class*='lessonPart']");
    fireEvent.click(node!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when lesson is locked", () => {
    const onClick = jest.fn();
    const lesson = createMockLesson({ locked: true });

    render(<LessonNode lesson={lesson} onClick={onClick} />);

    const node = screen.getByText("Test Lesson").closest("div[class*='lessonPart']");
    fireEvent.click(node!);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not throw when onClick is not provided", () => {
    const lesson = createMockLesson();

    render(<LessonNode lesson={lesson} />);

    const node = screen.getByText("Test Lesson").closest("div[class*='lessonPart']");
    expect(() => fireEvent.click(node!)).not.toThrow();
  });
});
