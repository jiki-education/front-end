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
    it("should render all hints collapsed initially", () => {
      const hints = ["First hint", "Second hint", "Third hint"];
      const { container } = render(<HintsView hints={hints} />);

      const hintItems = container.querySelectorAll(".hintItem");
      expect(hintItems).toHaveLength(3);

      // Hints should be in collapsed state (not expanded)
      expect(container.querySelector(".hintItem.expanded")).not.toBeInTheDocument();

      expect(screen.getByText("First hint")).toBeInTheDocument();
      expect(screen.getByText("Second hint")).toBeInTheDocument();
      expect(screen.getByText("Third hint")).toBeInTheDocument();
    });

    it("should show reveal buttons for all hints initially", () => {
      const hints = ["Hint 1", "Hint 2"];
      render(<HintsView hints={hints} />);

      expect(screen.getAllByText("Reveal")).toHaveLength(2);
    });

    it("should show numbered hint titles", () => {
      const hints = ["First", "Second", "Third"];
      render(<HintsView hints={hints} />);

      expect(screen.getByText("Hint 1")).toBeInTheDocument();
      expect(screen.getByText("Hint 2")).toBeInTheDocument();
      expect(screen.getByText("Hint 3")).toBeInTheDocument();
    });
  });

  describe("Revealing individual hints", () => {
    it("should show confirmation dialog when reveal button is clicked", () => {
      const hints = ["Test hint"];
      render(<HintsView hints={hints} />);

      const revealButton = screen.getByText("Reveal");
      fireEvent.click(revealButton);

      expect(screen.getByText("Are you sure you want to reveal this hint?")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("Not for now")).toBeInTheDocument();
    });

    it("should reveal a hint when confirmation is accepted", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      const revealButton = screen.getByText("Reveal");
      fireEvent.click(revealButton);

      const confirmButton = screen.getByText("Yes");
      fireEvent.click(confirmButton);

      expect(container.querySelector(".hintItem.expanded")).toBeInTheDocument();
      expect(screen.getByText("Hide")).toBeInTheDocument();
    });

    it("should cancel reveal when 'Not for now' is clicked", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      const revealButton = screen.getByText("Reveal");
      fireEvent.click(revealButton);

      const cancelButton = screen.getByText("Not for now");
      fireEvent.click(cancelButton);

      expect(container.querySelector(".hintItem.expanded")).not.toBeInTheDocument();
      expect(screen.getByText("Reveal")).toBeInTheDocument();
      expect(screen.queryByText("Are you sure you want to reveal this hint?")).not.toBeInTheDocument();
    });
  });

  describe("State persistence", () => {
    it("should allow hiding revealed hints", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      // Reveal the hint
      fireEvent.click(screen.getByText("Reveal"));
      fireEvent.click(screen.getByText("Yes"));

      expect(container.querySelector(".hintItem.expanded")).toBeInTheDocument();
      expect(screen.getByText("Hide")).toBeInTheDocument();

      // Hide the hint
      fireEvent.click(screen.getByText("Hide"));

      expect(container.querySelector(".hintItem.expanded")).not.toBeInTheDocument();
      expect(screen.getByText("Reveal")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle single hint correctly", () => {
      const hints = ["Only hint"];
      const { container } = render(<HintsView hints={hints} />);

      expect(screen.getByText("Only hint")).toBeInTheDocument();
      expect(screen.getByText("Hint 1")).toBeInTheDocument();
      expect(screen.getByText("Reveal")).toBeInTheDocument();
      expect(container.querySelectorAll(".hintItem")).toHaveLength(1);

      fireEvent.click(screen.getByText("Reveal"));
      fireEvent.click(screen.getByText("Yes"));

      expect(container.querySelector(".hintItem.expanded")).toBeInTheDocument();
      expect(screen.getByText("Hide")).toBeInTheDocument();
    });

    it("should handle empty string hints", () => {
      const hints = ["", "Valid hint", ""];
      render(<HintsView hints={hints} />);

      expect(screen.getByText("Valid hint")).toBeInTheDocument();
      expect(screen.getByText("Hint 1")).toBeInTheDocument();
      expect(screen.getByText("Hint 2")).toBeInTheDocument();
      expect(screen.getByText("Hint 3")).toBeInTheDocument();
      expect(screen.getAllByText("Reveal")).toHaveLength(3);
    });
  });

  describe("Accessibility", () => {
    it("should make reveal buttons clickable", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      const revealButton = container.querySelector(".hintRevealBtn");
      expect(revealButton?.tagName).toBe("BUTTON");
      expect(revealButton).toHaveClass("hintRevealBtn");
    });

    it("should provide clear button text for screen readers", () => {
      const hints = ["Hint 1", "Hint 2"];
      render(<HintsView hints={hints} />);

      expect(screen.getAllByText("Reveal")).toHaveLength(2);
    });
  });

  describe("Visual styling", () => {
    it("should apply correct CSS module classes", () => {
      const hints = ["Test hint"];
      const { container } = render(<HintsView hints={hints} />);

      const hintItem = container.querySelector(".hintItem");
      expect(hintItem).toBeInTheDocument();

      const hintQuestion = container.querySelector(".hintQuestion");
      expect(hintQuestion).toBeInTheDocument();
    });

    it("should style reveal buttons consistently", () => {
      const hints = ["Test"];
      const { container } = render(<HintsView hints={hints} />);

      const revealButton = container.querySelector(".hintRevealBtn");
      expect(revealButton).toHaveClass("hintRevealBtn");

      const revealText = container.querySelector(".revealText");
      expect(revealText).toHaveClass("revealText");
    });

    it("should render hint questions with proper structure", () => {
      const hints = ["Test"];
      const { container } = render(<HintsView hints={hints} />);

      const hintQuestion = container.querySelector(".hintQuestion");
      expect(hintQuestion).toBeInTheDocument();

      expect(screen.getByText("Hint 1")).toBeInTheDocument();
      expect(screen.getByText("Reveal")).toBeInTheDocument();
    });
  });
});
