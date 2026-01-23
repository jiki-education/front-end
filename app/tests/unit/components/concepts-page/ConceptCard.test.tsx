import ConceptCard from "@/components/concepts/ConceptCard";
import { render, screen } from "@testing-library/react";

const mockConcept = {
  slug: "test-concept",
  title: "Test Concept",
  description: "A test concept description"
};

describe("ConceptCard", () => {
  it("renders without crashing", () => {
    render(<ConceptCard concept={mockConcept} />);
    expect(screen.getByText("Test Concept")).toBeInTheDocument();
  });

  it("displays concept title and description", () => {
    render(<ConceptCard concept={mockConcept} />);
    expect(screen.getByText("Test Concept")).toBeInTheDocument();
    expect(screen.getByText("A test concept description")).toBeInTheDocument();
  });

  it("renders sub-concept count when provided", () => {
    const conceptWithSubConcepts = { ...mockConcept, subConceptCount: 5 };
    render(<ConceptCard concept={conceptWithSubConcepts} />);
    expect(screen.getByText("5 sub-concepts")).toBeInTheDocument();
  });

  it("does not render sub-concept count when not provided", () => {
    render(<ConceptCard concept={mockConcept} />);
    expect(screen.queryByText("sub-concepts")).not.toBeInTheDocument();
  });

  it("renders as a link when userMayAccess is true", () => {
    const accessibleConcept = { ...mockConcept, userMayAccess: true };
    render(<ConceptCard concept={accessibleConcept} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/concepts/test-concept");
  });

  it("renders as a link when userMayAccess is undefined", () => {
    render(<ConceptCard concept={mockConcept} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/concepts/test-concept");
  });

  it("renders as a div when userMayAccess is false", () => {
    const lockedConcept = { ...mockConcept, userMayAccess: false };
    render(<ConceptCard concept={lockedConcept} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows lock icon when userMayAccess is false", () => {
    const lockedConcept = { ...mockConcept, userMayAccess: false };
    const { container } = render(<ConceptCard concept={lockedConcept} />);
    expect(container.querySelector("[class*='lockedIcon']")).toBeInTheDocument();
  });

  it("does not show lock icon when userMayAccess is true", () => {
    const accessibleConcept = { ...mockConcept, userMayAccess: true };
    const { container } = render(<ConceptCard concept={accessibleConcept} />);
    expect(container.querySelector("[class*='lockedIcon']")).not.toBeInTheDocument();
  });
});
