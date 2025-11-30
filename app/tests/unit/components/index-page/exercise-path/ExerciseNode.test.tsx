import { ExerciseNode } from "@/components/dashboard/exercise-path/ExerciseNode";
import type { Exercise } from "@/components/dashboard/lib/mockData";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

function createMockExercise(overrides?: Partial<Exercise>): Exercise {
  return {
    id: "1",
    title: "Test Exercise",
    description: "Test description",
    type: "coding",
    difficulty: "easy",
    completed: false,
    locked: false,
    xpReward: 10,
    estimatedTime: 5,
    position: { x: 0, y: 0 },
    route: "/test",
    ...overrides
  };
}

describe("ExerciseNode", () => {
  it("renders exercise title and type label", () => {
    const exercise = createMockExercise({
      title: "Python Basics",
      type: "coding"
    });

    render(<ExerciseNode exercise={exercise} />);

    expect(screen.getByText("Python Basics")).toBeInTheDocument();
    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });

  it("displays correct label for different exercise types", () => {
    const { rerender } = render(<ExerciseNode exercise={createMockExercise({ type: "coding" })} />);
    expect(screen.getByText("Exercise")).toBeInTheDocument();

    rerender(<ExerciseNode exercise={createMockExercise({ type: "video" })} />);
    expect(screen.getByText("Video")).toBeInTheDocument();

    rerender(<ExerciseNode exercise={createMockExercise({ type: "quiz" })} />);
    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });

  it("applies correct styles for incomplete unlocked exercise", () => {
    const exercise = createMockExercise({
      completed: false,
      locked: false
    });

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white", "border-blue-400");
    expect(button).not.toBeDisabled();
  });

  it("applies correct styles for completed exercise", () => {
    const exercise = createMockExercise({
      completed: true,
      locked: false
    });

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-green-50", "border-green-400");
    expect(button).not.toBeDisabled();
  });

  it("applies correct styles and disabled state for locked exercise", () => {
    const exercise = createMockExercise({
      completed: false,
      locked: true
    });

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-100", "border-gray-300", "cursor-not-allowed", "opacity-60");
    expect(button).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = jest.fn();
    const exercise = createMockExercise({ locked: false });

    render(<ExerciseNode exercise={exercise} onClick={onClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when exercise is locked", () => {
    const onClick = jest.fn();
    const exercise = createMockExercise({ locked: true });

    render(<ExerciseNode exercise={exercise} onClick={onClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("provides default onClick handler when not provided", () => {
    const exercise = createMockExercise();

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const exercise = createMockExercise();

    render(<ExerciseNode ref={ref} exercise={exercise} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain("Test Exercise");
  });

  it("renders with correct accessibility attributes", () => {
    const exercise = createMockExercise({
      title: "Learn Variables",
      locked: true
    });

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("disabled");
  });

  it("applies hover styles for unlocked exercises", () => {
    const exercise = createMockExercise({ completed: false, locked: false });

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-blue-50", "hover:border-blue-500");
  });

  it("applies hover styles for completed exercises", () => {
    const exercise = createMockExercise({ completed: true, locked: false });

    render(<ExerciseNode exercise={exercise} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-green-100");
  });
});
