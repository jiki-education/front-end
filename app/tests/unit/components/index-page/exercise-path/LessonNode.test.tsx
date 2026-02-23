import type { LessonDisplayData } from "@/components/dashboard/exercise-path/types";
import { LessonNode } from "@/components/dashboard/exercise-path/ui/LessonNode";
import type { Lesson } from "@/types/lesson";
import { fireEvent, render, screen } from "@testing-library/react";

function createMockLessonDisplayData(overrides?: {
  lesson?: Partial<Lesson>;
  completed?: boolean;
  locked?: boolean;
  route?: string;
}): LessonDisplayData {
  return {
    lesson: {
      slug: "test-lesson",
      title: "Test Lesson",
      description: "Test description",
      type: "exercise",
      walkthrough_video_data: null,
      ...overrides?.lesson
    },
    completed: overrides?.completed ?? false,
    locked: overrides?.locked ?? false,
    route: overrides?.route ?? "/test"
  };
}

describe("LessonNode", () => {
  it("renders lesson title and description", () => {
    const lesson = createMockLessonDisplayData({
      lesson: {
        title: "Python Basics",
        description: "Learn the basics"
      }
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("Python Basics")).toBeInTheDocument();
    expect(screen.getByText("Learn the basics")).toBeInTheDocument();
  });

  it("displays correct label for different lesson types", () => {
    const { rerender } = render(<LessonNode lesson={createMockLessonDisplayData({ lesson: { type: "exercise" } })} />);
    expect(screen.getByText("Exercise")).toBeInTheDocument();

    rerender(<LessonNode lesson={createMockLessonDisplayData({ lesson: { type: "video" } })} />);
    expect(screen.getByText("Video")).toBeInTheDocument();

    rerender(<LessonNode lesson={createMockLessonDisplayData({ lesson: { type: "quiz" } })} />);
    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });

  it("displays correct status for incomplete unlocked lesson", () => {
    const lesson = createMockLessonDisplayData({
      completed: false,
      locked: false
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("displays correct status for completed lesson", () => {
    const lesson = createMockLessonDisplayData({
      completed: true,
      locked: false
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("displays correct status for locked lesson", () => {
    const lesson = createMockLessonDisplayData({
      completed: false,
      locked: true
    });

    render(<LessonNode lesson={lesson} />);

    expect(screen.getByText("Locked")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = jest.fn();
    const lesson = createMockLessonDisplayData({ locked: false });

    render(<LessonNode lesson={lesson} onClick={onClick} />);

    const node = screen.getByText("Test Lesson").closest("div[class*='lessonPart']");
    fireEvent.click(node!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when lesson is locked", () => {
    const onClick = jest.fn();
    const lesson = createMockLessonDisplayData({ locked: true });

    render(<LessonNode lesson={lesson} onClick={onClick} />);

    const node = screen.getByText("Test Lesson").closest("div[class*='lessonPart']");
    fireEvent.click(node!);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not throw when onClick is not provided", () => {
    const lesson = createMockLessonDisplayData();

    render(<LessonNode lesson={lesson} />);

    const node = screen.getByText("Test Lesson").closest("div[class*='lessonPart']");
    expect(() => fireEvent.click(node!)).not.toThrow();
  });
});
