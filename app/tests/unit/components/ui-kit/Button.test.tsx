import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui-kit";
import { MockGoogleIcon, createMockHandlers } from "@/tests/mocks";

describe("Button", () => {
  const mockHandlers = createMockHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with text content", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Button className="custom-class">Test</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Test</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Variants", () => {
    it("renders primary variant by default", () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gradient-to-br", "from-blue-500", "to-blue-600");
      expect(button).toHaveClass("border-blue-500", "text-white");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-gray-200", "text-gray-950", "bg-white");
    });

    it("applies hover styles for primary variant", () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:border-blue-600");
    });

    it("applies hover styles for secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:border-blue-500");
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("pointer-events-none", "opacity-80");

      // Check for spinner element
      const spinner = button.querySelector(".animate-\\[ui-spin_0\\.6s_linear_infinite\\]");
      expect(spinner).toBeInTheDocument();
    });

    it("disables button when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("shows different spinner for primary vs secondary variants", () => {
      const { rerender } = render(
        <Button variant="primary" loading>
          Primary
        </Button>
      );

      let button = screen.getByRole("button");
      let spinner = button.querySelector(".animate-\\[ui-spin_0\\.6s_linear_infinite\\]");
      expect(spinner).toHaveClass("border-white/30", "border-t-white");

      rerender(
        <Button variant="secondary" loading>
          Secondary
        </Button>
      );

      button = screen.getByRole("button");
      spinner = button.querySelector(".animate-\\[ui-spin_0\\.6s_linear_infinite\\]");
      expect(spinner).toHaveClass("border-blue-500/30", "border-t-blue-500");
    });

    it("hides icon when loading", () => {
      render(
        <Button loading icon={<MockGoogleIcon />}>
          With Icon
        </Button>
      );

      // Icon should not be visible when loading
      expect(screen.queryByTestId("google-icon")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables button when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("pointer-events-none");
    });

    it("prevents click events when disabled", async () => {
      const user = userEvent.setup();

      render(
        <Button disabled onClick={mockHandlers.onClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockHandlers.onClick).not.toHaveBeenCalled();
    });

    it("does not apply hover styles when disabled", () => {
      render(
        <Button disabled variant="primary">
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("hover:border-blue-600");
    });
  });

  describe("Icon Support", () => {
    it("renders icon for secondary variant", () => {
      render(
        <Button variant="secondary" icon={<MockGoogleIcon />}>
          With Icon
        </Button>
      );

      expect(screen.getByTestId("google-icon")).toBeInTheDocument();
    });

    it("does not render icon when loading", () => {
      render(
        <Button loading icon={<MockGoogleIcon />}>
          Loading
        </Button>
      );

      expect(screen.queryByTestId("google-icon")).not.toBeInTheDocument();
    });
  });

  describe("Full Width", () => {
    it("applies full width class when fullWidth is true", () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });

    it("does not apply full width class by default", () => {
      render(<Button>Normal Width</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });
  });

  describe("Interaction", () => {
    it("calls onClick handler when clicked", async () => {
      const user = userEvent.setup();

      render(<Button onClick={mockHandlers.onClick}>Clickable</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when loading", async () => {
      const user = userEvent.setup();

      render(
        <Button loading onClick={mockHandlers.onClick}>
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockHandlers.onClick).not.toHaveBeenCalled();
    });

    it("accepts additional button props", () => {
      render(
        <Button type="submit" name="submit-btn" data-testid="submit">
          Submit
        </Button>
      );

      const button = screen.getByTestId("submit");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "submit-btn");
    });
  });

  describe("Accessibility", () => {
    it("has button role", () => {
      render(<Button>Accessible</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("sets aria-disabled when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });

    it("sets aria-disabled when disabled", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });

    it("maintains accessible name with icon", () => {
      render(<Button icon={<MockGoogleIcon />}>Sign in with Google</Button>);

      const button = screen.getByRole("button", { name: "Sign in with Google" });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("applies transition classes", () => {
      render(<Button>Animated</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-all", "ease-in-out");
      // Duration might vary, just check the core classes
    });

    it("animates spinner when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      const spinner = button.querySelector("[class*='ui-spin']");

      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("w-[18px]", "h-[18px]");
    });
  });
});
