import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "@/components/ui-kit";
import { MockEmailIcon, MockEmailIconFocused, createMockHandlers } from "@/tests/mocks";

describe("FormField", () => {
  const mockHandlers = createMockHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders label and input field", () => {
      render(<FormField label="Email" />);

      const label = screen.getByLabelText("Email");
      const input = screen.getByRole("textbox");

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it("associates label with input using htmlFor", () => {
      render(<FormField label="Test Field" />);

      const label = screen.getByText("Test Field");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", input.id);
    });

    it("applies placeholder text", () => {
      render(<FormField label="Email" placeholder="Enter your email" />);

      const input = screen.getByPlaceholderText("Enter your email");
      expect(input).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<FormField ref={ref} label="Test" />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("Icon Behavior", () => {
    it("displays default icon initially", () => {
      render(<FormField label="Email" icon={<MockEmailIcon />} focusedIcon={<MockEmailIconFocused />} />);

      expect(screen.getByTestId("email-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("email-icon-focused")).toBeInTheDocument();

      // Default icon should be visible, focused icon should be hidden
      const defaultIcon = screen.getByTestId("email-icon").parentElement;
      const focusedIcon = screen.getByTestId("email-icon-focused").parentElement;

      expect(defaultIcon).toHaveClass("opacity-100");
      expect(focusedIcon).toHaveClass("opacity-0");
    });

    it("swaps to focused icon when input is focused", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" icon={<MockEmailIcon />} focusedIcon={<MockEmailIconFocused />} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      // After focus, default icon should be hidden and focused icon visible
      const defaultIcon = screen.getByTestId("email-icon").parentElement;
      const focusedIcon = screen.getByTestId("email-icon-focused").parentElement;

      expect(defaultIcon).toHaveClass("opacity-0");
      expect(focusedIcon).toHaveClass("opacity-100");
    });

    it("reverts to default icon when input loses focus", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" icon={<MockEmailIcon />} focusedIcon={<MockEmailIconFocused />} />);

      const input = screen.getByRole("textbox");

      // Focus then blur
      await user.click(input);
      await user.tab(); // Move focus away

      // Should be back to default icon
      const defaultIcon = screen.getByTestId("email-icon").parentElement;
      const focusedIcon = screen.getByTestId("email-icon-focused").parentElement;

      expect(defaultIcon).toHaveClass("opacity-100");
      expect(focusedIcon).toHaveClass("opacity-0");
    });

    it("shows only default icon when no focused icon provided", () => {
      render(<FormField label="Email" icon={<MockEmailIcon />} />);

      expect(screen.getByTestId("email-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("email-icon-focused")).not.toBeInTheDocument();
    });

    it("adds left padding when icon is present", () => {
      render(<FormField label="Email" icon={<MockEmailIcon />} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("pl-48");
    });
  });

  describe("Focus Behavior", () => {
    it("changes label color on focus", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" />);

      const label = screen.getByText("Email");
      const input = screen.getByRole("textbox");

      // Initially gray
      expect(label).toHaveClass("text-gray-700");

      await user.click(input);

      // Should turn blue on focus
      expect(label).toHaveClass("text-blue-500");
    });

    it("applies focus styles to input", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(input).toHaveClass("focus:border-blue-500");
      expect(input).toHaveClass("focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]");
    });

    it("calls custom onFocus handler", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" onFocus={mockHandlers.onFocus} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(mockHandlers.onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls custom onBlur handler", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" onBlur={mockHandlers.onBlur} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab(); // Blur the input

      expect(mockHandlers.onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error States", () => {
    it("displays error message when error prop is provided", () => {
      render(<FormField label="Email" error="Please enter a valid email" />);

      const errorMessage = screen.getByText("Please enter a valid email");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-error-500");
    });

    it("applies error styling to input border", () => {
      render(<FormField label="Email" error="Invalid email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-error-500");
    });

    it("applies shake animation when error is present", () => {
      render(<FormField label="Email" error="Error message" />);

      // Check for shake animation on outermost container
      const input = screen.getByRole("textbox");
      const outerContainer = input.closest("div")?.parentElement;
      expect(outerContainer?.className).toMatch(/ui-shake/);
    });

    it("sets aria-invalid when error is present", () => {
      render(<FormField label="Email" error="Error message" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("associates error message with input using aria-describedby", () => {
      render(<FormField label="Email" error="Error message" />);

      const input = screen.getByRole("textbox");
      const errorMessage = screen.getByText("Error message");

      expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    it("overrides focus border color when in error state", () => {
      render(<FormField label="Email" error="Error message" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("focus:border-blue-500");
    });
  });

  describe("Value and Change Handling", () => {
    it("accepts and displays value", () => {
      render(<FormField label="Email" value="test@example.com" onChange={mockHandlers.onChange} />);

      const input = screen.getByDisplayValue("test@example.com");
      expect(input).toBeInTheDocument();
    });

    it("calls onChange handler when value changes", async () => {
      const user = userEvent.setup();

      render(<FormField label="Email" onChange={mockHandlers.onChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(mockHandlers.onChange).toHaveBeenCalled();
    });

    it("accepts additional input props", () => {
      render(<FormField label="Email" type="email" name="email" required disabled data-testid="email-input" />);

      const input = screen.getByTestId("email-input");
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("name", "email");
      expect(input).toHaveAttribute("required");
      expect(input).toBeDisabled();
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      render(<FormField label="Email" className="custom-field-class" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-field-class");
    });

    it("has consistent sizing classes", () => {
      render(<FormField label="Email" />);

      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email");

      expect(input).toHaveClass("px-16", "py-[14px]", "text-[16px]");
      expect(label).toHaveClass("text-[15px]");
    });

    it("applies transition classes for smooth animations", () => {
      render(<FormField label="Email" />);

      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email");

      expect(input).toHaveClass("transition-all", "ease-in-out");
      expect(label).toHaveClass("transition-colors");
    });
  });

  describe("Accessibility", () => {
    it("has proper input role", () => {
      render(<FormField label="Search" type="search" />);

      const input = screen.getByRole("searchbox");
      expect(input).toBeInTheDocument();
    });

    it("maintains accessibility with different input types", () => {
      const { rerender } = render(<FormField label="Password" type="password" />);

      let input = screen.getByLabelText("Password");
      expect(input).toHaveAttribute("type", "password");

      rerender(<FormField label="Email" type="email" />);

      input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("type", "email");
    });

    it("provides accessible name via label association", () => {
      render(<FormField label="User Email" />);

      const input = screen.getByLabelText("User Email");
      expect(input).toBeInTheDocument();
    });
  });
});
