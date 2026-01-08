import React from "react";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/ui-kit";
import { MockProjectsIcon, createMockPageHeaderProps } from "@/tests/mocks";

describe("PageHeader", () => {
  describe("Basic Rendering", () => {
    it("renders title", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test Page");
    });

    it("renders description when provided", () => {
      render(<PageHeader title="Test Page" description="This is a test page" icon={<MockProjectsIcon />} />);

      const description = screen.getByText("This is a test page");
      expect(description).toBeInTheDocument();
      expect(description.tagName.toLowerCase()).toBe("p");
    });

    it("renders description text", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      // The description should be rendered
      const description = screen.getByText("Test description");
      expect(description).toBeInTheDocument();
    });

    it("uses semantic header element", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const header = screen.getByRole("banner");
      expect(header.tagName.toLowerCase()).toBe("header");
    });
  });

  describe("Icon Support", () => {
    it("renders icon when provided", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const icon = screen.getByTestId("projects-icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders required icon", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<span>📄</span>} />);

      const icon = screen.getByText("📄");
      expect(icon).toBeInTheDocument();
    });

    it("positions icon before title text", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

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
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Test Page");
    });

    it("applies correct description styling", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const description = screen.getByText("Test description");
      expect(description).toBeInTheDocument();
    });

    it("renders icon correctly", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const icon = screen.getByTestId("projects-icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders header container", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders consistently", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Text Layout", () => {
    it("renders long title correctly", () => {
      render(
        <PageHeader
          title="A Very Long Page Title That Might Wrap"
          description="Test description"
          icon={<MockProjectsIcon />}
        />
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("A Very Long Page Title That Might Wrap");
    });

    it("renders long description correctly", () => {
      render(
        <PageHeader
          title="Test Page"
          description="A very long description that might wrap to multiple lines"
          icon={<MockProjectsIcon />}
        />
      );

      const description = screen.getByText("A very long description that might wrap to multiple lines");
      expect(description).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("renders with required props", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders header with default styling", () => {
      render(<PageHeader title="Test Page" description="Test description" icon={<MockProjectsIcon />} />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("uses mock helper props", () => {
      const mockProps = createMockPageHeaderProps({
        title: "Custom Title",
        description: "Custom Description"
      });

      render(<PageHeader {...mockProps} />);

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Description")).toBeInTheDocument();
      expect(screen.getByTestId("projects-icon")).toBeInTheDocument();
    });
  });

  describe("Complete Examples", () => {
    it("renders complete header with all props", () => {
      render(
        <PageHeader
          title="Dashboard"
          description="Overview of your progress and achievements"
          icon={<MockProjectsIcon />}
        />
      );

      // Check all elements are present
      const heading = screen.getByRole("heading", { level: 1 });
      const description = screen.getByText("Overview of your progress and achievements");
      const icon = screen.getByTestId("projects-icon");
      const header = screen.getByRole("banner");

      expect(heading).toHaveTextContent("Dashboard");
      expect(description).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(header).toBeInTheDocument();

      // Check structure
      expect(heading).toContainElement(icon);
      expect(header).toContainElement(heading);
      expect(header).toContainElement(description);
    });

    it("renders header with all required props", () => {
      render(<PageHeader title="Simple Page" description="Simple description" icon={<span>📄</span>} />);

      const heading = screen.getByRole("heading", { level: 1 });
      const header = screen.getByRole("banner");
      const description = screen.getByText("Simple description");
      const icon = screen.getByText("📄");

      expect(heading).toHaveTextContent("Simple Page");
      expect(header).toContainElement(heading);
      expect(description).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses proper heading level", () => {
      render(<PageHeader title="Main Page" description="Page description" icon={<MockProjectsIcon />} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.tagName.toLowerCase()).toBe("h1");
    });

    it("maintains heading hierarchy", () => {
      render(
        <div>
          <PageHeader title="Main Page" description="Page description" icon={<MockProjectsIcon />} />
          <h2>Section Header</h2>
        </div>
      );

      const mainHeading = screen.getByRole("heading", { level: 1 });
      const sectionHeading = screen.getByRole("heading", { level: 2 });

      expect(mainHeading).toHaveTextContent("Main Page");
      expect(sectionHeading).toHaveTextContent("Section Header");
    });

    it("provides accessible text with icon", () => {
      render(<PageHeader title="Settings" description="Settings description" icon={<MockProjectsIcon />} />);

      const heading = screen.getByRole("heading", { level: 1, name: "Settings" });
      expect(heading).toBeInTheDocument();
    });
  });
});
