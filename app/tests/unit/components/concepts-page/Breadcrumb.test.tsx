import Breadcrumb from "@/components/concepts/Breadcrumb";
import { render, screen } from "@testing-library/react";

describe("Breadcrumb", () => {
  it("renders without crashing", () => {
    render(<Breadcrumb />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
  });

  it("renders All Concepts as current when no conceptTitle provided", () => {
    render(<Breadcrumb />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
    expect(screen.getByText("All Concepts")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "All Concepts" })).not.toBeInTheDocument();
  });

  it("renders concept title with link to All Concepts when conceptTitle provided", () => {
    render(<Breadcrumb conceptTitle="Test Concept" />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All Concepts" })).toHaveAttribute("href", "/concepts");
    expect(screen.getByText("Test Concept")).toBeInTheDocument();
  });

  it("renders ancestors as links", () => {
    const ancestors = [
      { title: "Parent Concept", slug: "parent-concept" },
      { title: "Grandparent", slug: "grandparent" }
    ];
    render(<Breadcrumb conceptTitle="Current Concept" ancestors={ancestors} />);

    expect(screen.getByRole("link", { name: "Parent Concept" })).toHaveAttribute("href", "/concepts/parent-concept");
    expect(screen.getByRole("link", { name: "Grandparent" })).toHaveAttribute("href", "/concepts/grandparent");
    expect(screen.getByText("Current Concept")).toBeInTheDocument();
  });

  it("does not render link for current concept", () => {
    render(<Breadcrumb conceptTitle="Current Concept" />);
    expect(screen.queryByRole("link", { name: "Current Concept" })).not.toBeInTheDocument();
  });
});
