import { EmptyState, ErrorState } from "@/components/concepts/ErrorStates";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAuthStore } from "@/lib/auth/authStore";

jest.mock("@/lib/auth/authStore");
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe("ErrorState", () => {
  const defaultProps = {
    error: "Something went wrong",
    onRetry: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    render(<ErrorState {...defaultProps} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("displays error message and retry button", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    render(<ErrorState {...defaultProps} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    const mockOnRetry = jest.fn();
    render(<ErrorState {...defaultProps} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole("button", { name: "Try Again" });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalled();
  });

  it("renders with sidebar layout when authenticated", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: true } as any));
    const { container } = render(<ErrorState {...defaultProps} />);
    expect(container.querySelector(".ml-\\[260px\\]")).toBeInTheDocument();
  });

  it("renders without sidebar layout when not authenticated", () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ isAuthenticated: false } as any));
    const { container } = render(<ErrorState {...defaultProps} />);
    expect(container.querySelector(".container")).toBeInTheDocument();
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
