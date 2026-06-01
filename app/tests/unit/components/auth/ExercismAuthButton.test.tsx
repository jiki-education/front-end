/**
 * Unit tests for ExercismAuthButton component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExercismAuthButton } from "@/components/auth/ExercismAuthButton";
import { isExercismAuthEnabled, beginExercismAuth } from "@/lib/auth/exercism";

// Mock the Exercism OAuth helpers
jest.mock("@/lib/auth/exercism", () => ({
  isExercismAuthEnabled: jest.fn(),
  beginExercismAuth: jest.fn()
}));

const mockIsExercismAuthEnabled = isExercismAuthEnabled as jest.MockedFunction<typeof isExercismAuthEnabled>;
const mockBeginExercismAuth = beginExercismAuth as jest.MockedFunction<typeof beginExercismAuth>;

describe("ExercismAuthButton", () => {
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when Exercism OAuth is configured", () => {
    beforeEach(() => {
      mockIsExercismAuthEnabled.mockReturnValue(true);
    });

    it("should render button with children text", () => {
      render(<ExercismAuthButton onError={mockOnError}>Use Exercism</ExercismAuthButton>);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Use Exercism")).toBeInTheDocument();
    });

    it("should start the Exercism auth flow when clicked", () => {
      render(<ExercismAuthButton onError={mockOnError}>Use Exercism</ExercismAuthButton>);

      fireEvent.click(screen.getByRole("button"));

      expect(mockBeginExercismAuth).toHaveBeenCalledTimes(1);
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it("should call onError when starting the flow fails", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      mockBeginExercismAuth.mockImplementation(() => {
        throw new Error("boom");
      });

      render(<ExercismAuthButton onError={mockOnError}>Use Exercism</ExercismAuthButton>);

      fireEvent.click(screen.getByRole("button"));

      expect(mockOnError).toHaveBeenCalledTimes(1);
      consoleErrorSpy.mockRestore();
    });

    it("should not throw when starting the flow fails and no onError is provided", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      mockBeginExercismAuth.mockImplementation(() => {
        throw new Error("boom");
      });

      render(<ExercismAuthButton>Use Exercism</ExercismAuthButton>);

      expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
      consoleErrorSpy.mockRestore();
    });

    it("should have correct CSS classes for styling", () => {
      render(<ExercismAuthButton onError={mockOnError}>Use Exercism</ExercismAuthButton>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("ui-btn ui-btn-tertiary");
    });

    it("should be accessible with proper button role", () => {
      render(<ExercismAuthButton onError={mockOnError}>Use Exercism</ExercismAuthButton>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("when Exercism OAuth is not configured", () => {
    beforeEach(() => {
      mockIsExercismAuthEnabled.mockReturnValue(false);
    });

    it("should not render anything", () => {
      const { container } = render(<ExercismAuthButton onError={mockOnError}>Use Exercism</ExercismAuthButton>);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });
});
