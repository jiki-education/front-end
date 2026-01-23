import ConceptsSearch from "@/components/concepts/ConceptsSearch";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ConceptsSearch", () => {
  const defaultProps = {
    searchQuery: "",
    onSearchChange: jest.fn(),
    onClearSearch: jest.fn(),
    debouncedSearchQuery: "",
    isLoading: false,
    totalCount: 0
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

  it("shows searching state when loading with results", () => {
    render(<ConceptsSearch {...defaultProps} debouncedSearchQuery="test" isLoading={true} totalCount={1} />);
    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("shows empty state when no results found", () => {
    render(<ConceptsSearch {...defaultProps} debouncedSearchQuery="test" totalCount={0} isLoading={false} />);
    expect(screen.getByText(/0 results for/)).toBeInTheDocument();
    expect(screen.getByText("Try a different search term or browse the library.")).toBeInTheDocument();
  });
});
