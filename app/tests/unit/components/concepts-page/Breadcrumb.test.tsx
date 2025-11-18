import { render, screen } from "@testing-library/react";
import Breadcrumb from "@/components/concepts-page/Breadcrumb";

describe("Breadcrumb", () => {
  it("renders without crashing", () => {
    render(<Breadcrumb />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
  });

  it("renders default breadcrumb items when no items provided", () => {
    render(<Breadcrumb conceptTitle="Test Concept" />);
    expect(screen.getByText("Library:")).toBeInTheDocument();
    expect(screen.getByText("All Concepts")).toBeInTheDocument();
    expect(screen.getByText("Test Concept")).toBeInTheDocument();
  });

  it("renders custom breadcrumb items when provided", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Current Page", isCurrent: true }
    ];
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();
  });

  it("renders links for items with href", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Current Page", isCurrent: true }
    ];
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("does not render links for current items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Current Page", isCurrent: true }
    ];
    render(<Breadcrumb items={items} />);
    expect(screen.queryByRole("link", { name: "Current Page" })).not.toBeInTheDocument();
  });
});
