import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState, EmptyState } from "@/components/concepts-page/ErrorStates";

describe("ErrorState", () => {
  const defaultProps = {
    error: "Something went wrong",
    onRetry: jest.fn(),
    withSidebar: false
  };

  it("renders without crashing", () => {
    render(<ErrorState {...defaultProps} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("displays error message and retry button", () => {
    render(<ErrorState {...defaultProps} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const mockOnRetry = jest.fn();
    render(<ErrorState {...defaultProps} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole("button", { name: "Try Again" });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalled();
  });

  it("renders with sidebar layout when withSidebar is true", () => {
    const { container } = render(<ErrorState {...defaultProps} withSidebar={true} />);
    expect(container.querySelector(".ml-\\[260px\\]")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  const defaultProps = {
    debouncedSearchQuery: "",
    onClearSearch: jest.fn(),
    isAuthenticated: false
  };

  it("renders without crashing", () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByText("No concepts available at the moment.")).toBeInTheDocument();
  });

  it("shows no search results message when search query is provided", () => {
    render(<EmptyState {...defaultProps} debouncedSearchQuery="test" />);
    expect(screen.getByText('No concepts found for "test"')).toBeInTheDocument();
  });

  it("shows clear search button when search query is provided", () => {
    render(<EmptyState {...defaultProps} debouncedSearchQuery="test" />);
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  it("calls onClearSearch when clear search button is clicked", () => {
    const mockOnClearSearch = jest.fn();
    render(<EmptyState {...defaultProps} debouncedSearchQuery="test" onClearSearch={mockOnClearSearch} />);

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    fireEvent.click(clearButton);

    expect(mockOnClearSearch).toHaveBeenCalled();
  });

  it("does not show clear search button when no search query", () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
