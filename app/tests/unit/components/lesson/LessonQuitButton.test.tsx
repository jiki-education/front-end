import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import { showConfirmation } from "@/lib/modal";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

// Mock the modal store
jest.mock("@/lib/modal", () => ({
  showConfirmation: jest.fn()
}));

// Mock Next.js router
const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    back: mockRouterBack,
    push: mockRouterPush
  }))
}));

describe("LessonQuitButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the quit button with correct accessibility attributes", () => {
    render(<LessonQuitButton />);

    const button = screen.getByRole("button", { name: "Quit lesson" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Quit lesson");
  });

  it("should show confirmation modal when clicked", () => {
    render(<LessonQuitButton />);

    const button = screen.getByRole("button", { name: "Quit lesson" });
    fireEvent.click(button);

    expect(showConfirmation).toHaveBeenCalledTimes(1);
    expect(showConfirmation).toHaveBeenCalledWith({
      title: "Quit Lesson",
      message: "Are you sure you want to quit this lesson? Your progress won't be saved.",
      confirmText: "Quit",
      cancelText: "Continue Learning",
      variant: "danger",
      onConfirm: expect.any(Function)
    });
  });

  it("should call custom onQuit callback when confirmed", () => {
    const mockOnQuit = jest.fn();
    render(<LessonQuitButton onQuit={mockOnQuit} />);

    const button = screen.getByRole("button", { name: "Quit lesson" });
    fireEvent.click(button);

    // Get the onConfirm callback from the mock call
    const confirmationCall = (showConfirmation as jest.Mock).mock.calls[0][0];
    const { onConfirm } = confirmationCall;

    // Execute the onConfirm callback
    act(() => {
      onConfirm();
    });

    expect(mockOnQuit).toHaveBeenCalledTimes(1);
    expect(mockRouterBack).not.toHaveBeenCalled();
  });

  it("should navigate to home when no onQuit callback is provided", () => {
    render(<LessonQuitButton />);

    const button = screen.getByRole("button", { name: "Quit lesson" });
    fireEvent.click(button);

    // Get the onConfirm callback from the mock call
    const confirmationCall = (showConfirmation as jest.Mock).mock.calls[0][0];
    const { onConfirm } = confirmationCall;

    // Execute the onConfirm callback
    act(() => {
      onConfirm();
    });

    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith("/");
    expect(mockRouterBack).not.toHaveBeenCalled();
  });

  it("should apply custom className to button", () => {
    render(<LessonQuitButton className="custom-class" />);

    const button = screen.getByRole("button", { name: "Quit lesson" });
    expect(button).toHaveClass("custom-class");
  });

  it("should not trigger any action when modal is cancelled", () => {
    const mockOnQuit = jest.fn();
    render(<LessonQuitButton onQuit={mockOnQuit} />);

    const button = screen.getByRole("button", { name: "Quit lesson" });
    fireEvent.click(button);

    // Verify modal was shown but don't execute onConfirm
    expect(showConfirmation).toHaveBeenCalledTimes(1);

    // Verify no navigation or quit callback was executed
    expect(mockOnQuit).not.toHaveBeenCalled();
    expect(mockRouterBack).not.toHaveBeenCalled();
  });
});
