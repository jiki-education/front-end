import HintsView from "@/components/coding-exercise/ui/HintsPanel";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

describe("HintsView", () => {
  describe("Empty state", () => {
    it("should display no hints message when hints is undefined", () => {
      render(<HintsView hints={undefined} />);

      expect(screen.getByText("No hints available for this exercise.")).toBeInTheDocument();
    });

    it("should display no hints message when hints array is empty", () => {
      render(<HintsView hints={[]} />);

      expect(screen.getByText("No hints available for this exercise.")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<HintsView hints={[]} className="custom-class" />);

      expect(container.firstChild).toHaveClass("p-4", "custom-class");
    });
  });

  describe("Initial render with hints", () => {
    it("should render all hints blurred initially", () => {
      const hints = ["First hint", "Second hint", "Third hint"];
      const { container } = render(<HintsView hints={hints} />);

      const blurredElements = container.querySelectorAll(".blur-sm");
      expect(blurredElements).toHaveLength(3);

      expect(screen.getByText("First hint")).toBeInTheDocument();
      expect(screen.getByText("Second hint")).toBeInTheDocument();
      expect(screen.getByText("Third hint")).toBeInTheDocument();
    });

    it("should show reveal buttons for all hints initially", () => {
      const hints = ["Hint 1", "Hint 2"];
      render(<HintsView hints={hints} />);

      expect(screen.getByText("Reveal hint 1")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 2")).toBeInTheDocument();
    });

    it("should show numbered indicators for each hint", () => {
      const hints = ["First", "Second", "Third"];
      render(<HintsView hints={hints} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Revealing individual hints", () => {
    it("should reveal a hint when reveal button is clicked", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      const revealButton = screen.getByText("Reveal hint 1");
      fireEvent.click(revealButton);

      expect(container.querySelector(".blur-sm")).not.toBeInTheDocument();
      expect(screen.queryByText("Reveal hint 1")).not.toBeInTheDocument();
    });

    it("should only reveal the clicked hint, leaving others blurred", () => {
      const hints = ["First hint", "Second hint", "Third hint"];
      const { container } = render(<HintsView hints={hints} />);

      const secondRevealButton = screen.getByText("Reveal hint 2");
      fireEvent.click(secondRevealButton);

      const blurredElements = container.querySelectorAll(".blur-sm");
      expect(blurredElements).toHaveLength(2);

      expect(screen.queryByText("Reveal hint 2")).not.toBeInTheDocument();
      expect(screen.getByText("Reveal hint 1")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 3")).toBeInTheDocument();
    });

    it("should reveal multiple hints independently", () => {
      const hints = ["Hint A", "Hint B", "Hint C"];
      const { container } = render(<HintsView hints={hints} />);

      fireEvent.click(screen.getByText("Reveal hint 1"));
      fireEvent.click(screen.getByText("Reveal hint 3"));

      const blurredElements = container.querySelectorAll(".blur-sm");
      expect(blurredElements).toHaveLength(1);

      expect(screen.queryByText("Reveal hint 1")).not.toBeInTheDocument();
      expect(screen.getByText("Reveal hint 2")).toBeInTheDocument();
      expect(screen.queryByText("Reveal hint 3")).not.toBeInTheDocument();
    });
  });

  describe("State persistence", () => {
    it("should keep revealed hints revealed after revealing new ones", () => {
      const hints = ["First", "Second", "Third"];
      const { container } = render(<HintsView hints={hints} />);

      fireEvent.click(screen.getByText("Reveal hint 1"));
      fireEvent.click(screen.getByText("Reveal hint 2"));

      const blurredElements = container.querySelectorAll(".blur-sm");
      expect(blurredElements).toHaveLength(1);

      expect(screen.queryByText("Reveal hint 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Reveal hint 2")).not.toBeInTheDocument();
      expect(screen.getByText("Reveal hint 3")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle single hint correctly", () => {
      const hints = ["Only hint"];
      const { container } = render(<HintsView hints={hints} />);

      expect(screen.getByText("Only hint")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 1")).toBeInTheDocument();
      expect(container.querySelectorAll(".blur-sm")).toHaveLength(1);

      fireEvent.click(screen.getByText("Reveal hint 1"));

      expect(container.querySelector(".blur-sm")).not.toBeInTheDocument();
      expect(screen.queryByText("Reveal hint 1")).not.toBeInTheDocument();
    });

    it("should handle empty string hints", () => {
      const hints = ["", "Valid hint", ""];
      render(<HintsView hints={hints} />);

      expect(screen.getByText("Valid hint")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 1")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 2")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 3")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should make reveal buttons clickable", () => {
      const hints = ["Test hint"];
      render(<HintsView hints={hints} />);

      const revealButton = screen.getByText("Reveal hint 1");
      expect(revealButton.tagName).toBe("BUTTON");
      expect(revealButton).toHaveClass("px-3", "py-1.5");
    });

    it("should provide clear button text for screen readers", () => {
      const hints = ["Hint 1", "Hint 2"];
      render(<HintsView hints={hints} />);

      expect(screen.getByText("Reveal hint 1")).toBeInTheDocument();
      expect(screen.getByText("Reveal hint 2")).toBeInTheDocument();
    });
  });

  describe("Visual styling", () => {
    it("should apply correct blur and transition classes", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      const hintContainer = container.querySelector(".blur-sm");
      expect(hintContainer).toHaveClass("transition-all", "duration-300");
    });

    it("should style reveal buttons consistently", () => {
      const hints = ["Test"];
      render(<HintsView hints={hints} />);

      const revealButton = screen.getByText("Reveal hint 1");
      expect(revealButton).toHaveClass(
        "px-3",
        "py-1.5",
        "bg-blue-600",
        "text-white",
        "text-xs",
        "rounded",
        "font-medium",
        "hover:bg-blue-700",
        "transition-colors",
        "shadow-sm"
      );
    });

    it("should style hint indicators correctly", () => {
      const hints = ["Test"];
      const { container } = render(<HintsView hints={hints} />);

      const indicator = container.querySelector(".bg-blue-100");
      expect(indicator).toHaveClass(
        "flex-shrink-0",
        "w-6",
        "h-6",
        "rounded-full",
        "bg-blue-100",
        "text-blue-700",
        "text-xs",
        "flex",
        "items-center",
        "justify-center",
        "font-medium"
      );
    });
  });
});
