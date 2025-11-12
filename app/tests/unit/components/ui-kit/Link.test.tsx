import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link } from "@/components/ui-kit";
import { createMockHandlers } from "@/tests/mocks";

describe("Link", () => {
  const mockHandlers = createMockHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders as an anchor element", () => {
      render(<Link href="/test">Test Link</Link>);

      const link = screen.getByRole("link", { name: "Test Link" });
      expect(link).toBeInTheDocument();
      expect(link.tagName.toLowerCase()).toBe("a");
    });

    it("renders children content", () => {
      render(<Link href="/test">Click here to navigate</Link>);

      const link = screen.getByText("Click here to navigate");
      expect(link).toBeInTheDocument();
    });

    it("accepts href attribute", () => {
      render(<Link href="/dashboard">Dashboard</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/dashboard");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(
        <Link ref={ref} href="/test">
          Test
        </Link>
      );

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe("Styling", () => {
    it("applies base link styling", () => {
      render(<Link href="/test">Styled Link</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("text-blue-500", "no-underline", "font-medium");
    });

    it("applies hover styling", () => {
      render(<Link href="/test">Hover Link</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("hover:underline");
    });

    it("applies transition styling", () => {
      render(<Link href="/test">Animated Link</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("transition-all", "duration-200", "ease-in-out");
    });

    it("applies custom className", () => {
      render(
        <Link href="/test" className="custom-link-class">
          Custom Link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-link-class");
      expect(link).toHaveClass("text-blue-500"); // Still has base classes
    });

    it("merges multiple custom classes", () => {
      render(
        <Link href="/test" className="custom-1 custom-2 font-bold">
          Multi-class Link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-1", "custom-2", "font-bold");
      expect(link).toHaveClass("text-blue-500", "hover:underline");
    });
  });

  describe("Font Size Inheritance", () => {
    it("inherits font size from parent context", () => {
      render(
        <div className="text-sm">
          <Link href="/test">Small Link</Link>
        </div>
      );

      const link = screen.getByRole("link");
      // Should not have explicit font size classes, allowing inheritance
      expect(link).not.toHaveClass("text-base", "text-lg", "text-sm");
    });

    it("works in different text size contexts", () => {
      const { rerender } = render(
        <div className="text-lg">
          <Link href="/test">Large Context Link</Link>
        </div>
      );

      let link = screen.getByRole("link");
      expect(link).toBeInTheDocument();

      rerender(
        <div className="text-xs">
          <Link href="/test">Small Context Link</Link>
        </div>
      );

      link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("can be clicked", async () => {
      const user = userEvent.setup();

      render(
        <Link href="/test" onClick={mockHandlers.onClick}>
          Clickable Link
        </Link>
      );

      const link = screen.getByRole("link");
      await user.click(link);

      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();

      render(
        <Link href="/test" onClick={mockHandlers.onClick}>
          Keyboard Link
        </Link>
      );

      const link = screen.getByRole("link");
      link.focus();

      await user.keyboard("{Enter}");

      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it("can receive focus", async () => {
      const user = userEvent.setup();

      render(<Link href="/test">Focusable Link</Link>);

      const link = screen.getByRole("link");
      await user.tab();

      expect(link).toHaveFocus();
    });
  });

  describe("HTML Attributes", () => {
    it("accepts standard anchor attributes", () => {
      render(
        <Link href="/external" target="_blank" rel="noopener noreferrer" title="External link">
          External Link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/external");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("title", "External link");
    });

    it("accepts data attributes", () => {
      render(
        <Link href="/test" data-testid="custom-link" data-analytics="link-click">
          Data Link
        </Link>
      );

      const link = screen.getByTestId("custom-link");
      expect(link).toHaveAttribute("data-analytics", "link-click");
    });

    it("accepts event handlers", async () => {
      const user = userEvent.setup();

      render(
        <Link href="/test" onClick={mockHandlers.onClick} onFocus={mockHandlers.onFocus} onBlur={mockHandlers.onBlur}>
          Event Link
        </Link>
      );

      const link = screen.getByRole("link");

      await user.click(link);
      expect(mockHandlers.onClick).toHaveBeenCalled();

      await user.tab();
      expect(mockHandlers.onFocus).toHaveBeenCalled();

      await user.tab();
      expect(mockHandlers.onBlur).toHaveBeenCalled();
    });
  });

  describe("Different Link Types", () => {
    it("handles internal navigation links", () => {
      render(<Link href="/dashboard">Dashboard</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/dashboard");
    });

    it("handles external links", () => {
      render(
        <Link href="https://example.com" target="_blank">
          External Site
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("handles email links", () => {
      render(<Link href="mailto:test@example.com">Email Us</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "mailto:test@example.com");
    });

    it("handles anchor links", () => {
      render(<Link href="#section">Jump to Section</Link>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "#section");
    });
  });

  describe("Content Variations", () => {
    it("renders text content", () => {
      render(<Link href="/test">Simple text link</Link>);

      const link = screen.getByText("Simple text link");
      expect(link).toBeInTheDocument();
    });

    it("renders with nested elements", () => {
      render(
        <Link href="/test">
          <span>Nested content</span> link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toContainHTML("<span>Nested content</span> link");
    });

    it("renders with icons or other components", () => {
      render(
        <Link href="/test">
          <svg data-testid="link-icon" />
          Link with icon
        </Link>
      );

      const link = screen.getByRole("link");
      const icon = screen.getByTestId("link-icon");
      expect(link).toContainElement(icon);
    });
  });

  describe("Accessibility", () => {
    it("has link role", () => {
      render(<Link href="/test">Accessible Link</Link>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("provides accessible name from content", () => {
      render(<Link href="/dashboard">Go to Dashboard</Link>);

      const link = screen.getByRole("link", { name: "Go to Dashboard" });
      expect(link).toBeInTheDocument();
    });

    it("supports aria-label for complex content", () => {
      render(
        <Link href="/test" aria-label="Download PDF file">
          <svg data-testid="download-icon" />
          Download
        </Link>
      );

      const link = screen.getByRole("link", { name: "Download PDF file" });
      expect(link).toBeInTheDocument();
    });

    it("maintains tab navigation order", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Link href="/first">First Link</Link>
          <Link href="/second">Second Link</Link>
          <Link href="/third">Third Link</Link>
        </div>
      );

      // Tab through links in order
      await user.tab();
      expect(screen.getByText("First Link")).toHaveFocus();

      await user.tab();
      expect(screen.getByText("Second Link")).toHaveFocus();

      await user.tab();
      expect(screen.getByText("Third Link")).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty href", () => {
      render(<Link href="">Empty Link</Link>);

      const link = screen.getByText("Empty Link");
      expect(link).toHaveAttribute("href", "");
    });

    it("handles undefined href", () => {
      // TypeScript would normally prevent this, but testing runtime behavior
      render(<Link {...({ href: undefined } as any)}>No Href Link</Link>);

      const link = screen.getByText("No Href Link");
      expect(link.tagName.toLowerCase()).toBe("a");
    });

    it("handles very long text content", () => {
      const longText =
        "This is a very long link text that might wrap to multiple lines and should still maintain proper styling and accessibility";

      render(<Link href="/test">{longText}</Link>);

      const link = screen.getByText(longText);
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass("text-blue-500");
    });

    it("maintains styling when disabled", () => {
      render(
        <Link href="/test" className="disabled">
          Disabled Link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("text-blue-500", "hover:underline", "disabled");
    });
  });
});
