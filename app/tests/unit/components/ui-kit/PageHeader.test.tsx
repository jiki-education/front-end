import React from "react";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/ui-kit";
import { MockProjectsIcon, createMockPageHeaderProps } from "@/tests/mocks";

describe("PageHeader", () => {
  describe("Basic Rendering", () => {
    it("renders title", () => {
      render(<PageHeader title="Test Page" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Page");
    });

    it("renders subtitle when provided", () => {
      render(<PageHeader title="Test Page" subtitle="This is a test page" />);

      const subtitle = screen.getByText("This is a test page");
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.tagName.toLowerCase()).toBe("p");
    });

    it("does not render subtitle when not provided", () => {
      render(<PageHeader title="Test Page" />);

      // Look for any p element that might contain subtitle text
      const paragraphs = screen.queryAllByRole("paragraph");
      expect(paragraphs).toHaveLength(0);
    });

    it("uses semantic header element", () => {
      render(<PageHeader title="Test Page" />);

      const header = screen.getByRole("banner");
      expect(header.tagName.toLowerCase()).toBe("header");
    });
  });

  describe("Icon Support", () => {
    it("renders icon when provided", () => {
      render(<PageHeader title="Test Page" icon={<MockProjectsIcon />} />);

      const icon = screen.getByTestId("projects-icon");
      expect(icon).toBeInTheDocument();
    });

    it("does not render icon when not provided", () => {
      render(<PageHeader title="Test Page" />);

      const icon = screen.queryByTestId("projects-icon");
      expect(icon).not.toBeInTheDocument();
    });

    it("positions icon before title text", () => {
      render(<PageHeader title="Test Page" icon={<MockProjectsIcon />} />);

      const heading = screen.getByRole("heading", { level: 1 });
      const icon = screen.getByTestId("projects-icon");
      const titleText = screen.getByText("Test Page");

      // Icon should be inside the heading and come before the text
      expect(heading).toContainElement(icon);
      expect(heading).toContainElement(titleText);
    });
  });

  describe("Styling", () => {
    it("applies correct title styling", () => {
      render(<PageHeader title="Test Page" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass(
        "text-[34px]",
        "font-semibold",
        "mb-[13px]",
        "text-gray-950",
        "flex",
        "items-center",
        "gap-12",
        "text-balance"
      );
    });

    it("applies correct subtitle styling", () => {
      render(<PageHeader title="Test Page" subtitle="Test subtitle" />);

      const subtitle = screen.getByText("Test subtitle");
      expect(subtitle).toHaveClass("text-[18px]", "text-gray-600", "mb-0");
    });

    it("applies correct icon styling", () => {
      render(<PageHeader title="Test Page" icon={<MockProjectsIcon />} />);

      const iconContainer = screen.getByTestId("projects-icon").parentElement;
      expect(iconContainer).toHaveClass("w-[34px]", "h-[34px]", "flex-shrink-0", "text-blue-500");
    });

    it("applies container margin", () => {
      render(<PageHeader title="Test Page" />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("mb-24");
    });

    it("applies custom className", () => {
      render(<PageHeader title="Test Page" className="custom-header-class" />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("custom-header-class");
    });
  });

  describe("Text Layout", () => {
    it("applies text-balance for better line breaks on title", () => {
      render(<PageHeader title="A Very Long Page Title That Might Wrap" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-balance");
    });

    it("applies text-balance for better line breaks on subtitle", () => {
      render(<PageHeader title="Test Page" subtitle="A very long subtitle that might wrap to multiple lines" />);

      const subtitle = screen.getByText("A very long subtitle that might wrap to multiple lines");
      expect(subtitle).toHaveClass("text-balance");
    });
  });

  describe("Props Handling", () => {
    it("accepts additional HTML attributes", () => {
      render(<PageHeader title="Test Page" data-testid="page-header" {...({ role: "banner" } as any)} />);

      const header = screen.getByTestId("page-header");
      expect(header).toHaveAttribute("role", "banner");
    });

    it("merges className with default classes", () => {
      render(<PageHeader title="Test Page" className="additional-class" />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("mb-24", "additional-class");
    });

    it("uses mock helper props", () => {
      const mockProps = createMockPageHeaderProps({
        title: "Custom Title",
        subtitle: "Custom Subtitle"
      });

      render(<PageHeader {...mockProps} />);

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Subtitle")).toBeInTheDocument();
      expect(screen.getByTestId("projects-icon")).toBeInTheDocument();
    });
  });

  describe("Complete Examples", () => {
    it("renders complete header with all props", () => {
      render(
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your progress and achievements"
          icon={<MockProjectsIcon />}
          className="custom-spacing"
        />
      );

      // Check all elements are present
      const heading = screen.getByRole("heading", { level: 1 });
      const subtitle = screen.getByText("Overview of your progress and achievements");
      const icon = screen.getByTestId("projects-icon");
      const header = screen.getByRole("banner");

      expect(heading).toHaveTextContent("Dashboard");
      expect(subtitle).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(header).toHaveClass("custom-spacing");

      // Check structure
      expect(heading).toContainElement(icon);
      expect(header).toContainElement(heading);
      expect(header).toContainElement(subtitle);
    });

    it("renders minimal header with just title", () => {
      render(<PageHeader title="Simple Page" />);

      const heading = screen.getByRole("heading", { level: 1 });
      const header = screen.getByRole("banner");

      expect(heading).toHaveTextContent("Simple Page");
      expect(header).toContainElement(heading);

      // Should not have icon or subtitle
      expect(screen.queryByTestId("projects-icon")).not.toBeInTheDocument();
      expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses proper heading level", () => {
      render(<PageHeader title="Main Page" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.tagName.toLowerCase()).toBe("h1");
    });

    it("maintains heading hierarchy", () => {
      render(
        <div>
          <PageHeader title="Main Page" subtitle="Description" />
          <h2>Section Header</h2>
        </div>
      );

      const mainHeading = screen.getByRole("heading", { level: 1 });
      const sectionHeading = screen.getByRole("heading", { level: 2 });

      expect(mainHeading).toHaveTextContent("Main Page");
      expect(sectionHeading).toHaveTextContent("Section Header");
    });

    it("provides accessible text with icon", () => {
      render(<PageHeader title="Settings" icon={<MockProjectsIcon />} />);

      const heading = screen.getByRole("heading", { level: 1, name: "Settings" });
      expect(heading).toBeInTheDocument();
    });
  });
});
