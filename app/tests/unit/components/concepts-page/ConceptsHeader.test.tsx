import ConceptsHeader from "@/components/concepts/ConceptsHeader";
import { render, screen } from "@testing-library/react";

describe("ConceptsHeader", () => {
  it("renders without crashing", () => {
    render(<ConceptsHeader />);
    expect(screen.getByText("Concept Library")).toBeInTheDocument();
  });

  it("displays page heading", () => {
    render(<ConceptsHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Concept Library");
  });

  it("renders breadcrumb component", () => {
    render(<ConceptsHeader />);
    expect(screen.getByText("All Concepts")).toBeInTheDocument();
  });
});
