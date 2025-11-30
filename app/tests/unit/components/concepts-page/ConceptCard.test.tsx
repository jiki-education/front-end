import ConceptCard from "@/components/concepts/ConceptCard";
import { render, screen } from "@testing-library/react";

const mockConcept = {
  slug: "test-concept",
  title: "Test Concept",
  description: "A test concept description",
  iconSrc: "icons/test.svg"
};

describe("ConceptCard", () => {
  it("renders without crashing", () => {
    render(<ConceptCard concept={mockConcept} isAuthenticated={false} />);
    expect(screen.getByText("Test Concept")).toBeInTheDocument();
  });

  it("displays concept title and description", () => {
    render(<ConceptCard concept={mockConcept} isAuthenticated={false} />);
    expect(screen.getByText("Test Concept")).toBeInTheDocument();
    expect(screen.getByText("A test concept description")).toBeInTheDocument();
  });

  it("renders sub-concept count when provided", () => {
    const conceptWithSubConcepts = { ...mockConcept, subConceptCount: 5 };
    render(<ConceptCard concept={conceptWithSubConcepts} isAuthenticated={false} />);
    expect(screen.getByText("5 sub-concepts")).toBeInTheDocument();
  });

  it("does not render sub-concept count when not provided", () => {
    render(<ConceptCard concept={mockConcept} isAuthenticated={false} />);
    expect(screen.queryByText("sub-concepts")).not.toBeInTheDocument();
  });
});
