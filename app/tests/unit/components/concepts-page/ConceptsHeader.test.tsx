import { render, screen } from "@testing-library/react";
import ConceptsHeader from "@/components/concepts-page/ConceptsHeader";

describe("ConceptsHeader", () => {
  it("renders without crashing", () => {
    render(<ConceptsHeader isAuthenticated={false} />);
    expect(screen.getByText("Concept Library")).toBeInTheDocument();
  });

  it("displays page heading", () => {
    render(<ConceptsHeader isAuthenticated={false} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Concept Library");
  });

  it("shows sign up message when not authenticated", () => {
    render(<ConceptsHeader isAuthenticated={false} />);
    expect(screen.getByText(/Sign up to track your progress/)).toBeInTheDocument();
  });

  it("does not show sign up message when authenticated", () => {
    render(<ConceptsHeader isAuthenticated={true} />);
    expect(screen.queryByText(/Sign up to track your progress/)).not.toBeInTheDocument();
  });

  it("renders breadcrumb component", () => {
    render(<ConceptsHeader isAuthenticated={false} />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
    expect(screen.getByText("All Concepts")).toBeInTheDocument();
  });
});
