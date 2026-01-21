import { EmptyState, ErrorState } from "@/components/concepts/ErrorStates";
import { fireEvent, render, screen } from "@testing-library/react";

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
  it("renders nothing when no search query is provided", () => {
    const { container } = render(<EmptyState debouncedSearchQuery="" />);
    expect(container.firstChild).toBeNull();
  });

  it("shows no results message when search query is provided", () => {
    render(<EmptyState debouncedSearchQuery="test" />);
    expect(screen.getByText(/0 results for/)).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("shows try different search term message", () => {
    render(<EmptyState debouncedSearchQuery="test" />);
    expect(screen.getByText("Try a different search term or browse the library.")).toBeInTheDocument();
  });
});
