import ConceptsSearch from "@/components/concepts/ConceptsSearch";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ConceptsSearch", () => {
  const defaultProps = {
    searchQuery: "",
    onSearchChange: jest.fn(),
    onClearSearch: jest.fn(),
    debouncedSearchQuery: "",
    isLoading: false,
    totalCount: 0,
    isAuthenticated: false
  };

  it("renders without crashing", () => {
    render(<ConceptsSearch {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search concepts...")).toBeInTheDocument();
  });

  it("displays search input with placeholder", () => {
    render(<ConceptsSearch {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search concepts...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("calls onSearchChange when input changes", () => {
    const mockOnSearchChange = jest.fn();
    render(<ConceptsSearch {...defaultProps} onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText("Search concepts...");
    fireEvent.change(input, { target: { value: "test" } });

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it("shows clear button when searchQuery is not empty", () => {
    render(<ConceptsSearch {...defaultProps} searchQuery="test" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClearSearch when clear button is clicked", () => {
    const mockOnClearSearch = jest.fn();
    render(<ConceptsSearch {...defaultProps} searchQuery="test" onClearSearch={mockOnClearSearch} />);

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(mockOnClearSearch).toHaveBeenCalled();
  });

  it("shows search results info when debouncedSearchQuery is provided", () => {
    render(<ConceptsSearch {...defaultProps} debouncedSearchQuery="test" totalCount={5} />);
    expect(screen.getByText('5 results for "test"')).toBeInTheDocument();
  });

  it("shows searching state when loading", () => {
    render(<ConceptsSearch {...defaultProps} debouncedSearchQuery="test" isLoading={true} />);
    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });
});
