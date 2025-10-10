import { AuthHeader } from "@/components/layout/AuthHeader";
import { useAuthStore } from "@/stores/authStore";
import { render, screen, waitFor } from "@testing-library/react";

// Mock the auth store
jest.mock("@/stores/authStore");

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/blog"
  })
}));

describe("AuthHeader Hydration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading skeleton before hydration", () => {
    const mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: true
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockAuthStore);

    render(<AuthHeader title="Blog" />);

    // Should show static content
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Blog")).toHaveLength(2); // Title and nav link

    // Should have loading elements (animated divs)
    const loadingElements = document.querySelectorAll(".animate-pulse");
    expect(loadingElements.length).toBeGreaterThan(0);

    // Should NOT show auth-specific content yet
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    expect(screen.queryByText("Welcome")).not.toBeInTheDocument();
  });

  it("shows anonymous user UI after hydration", async () => {
    const mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockAuthStore);

    render(<AuthHeader title="Articles" />);

    // Wait for component to mount (hydration simulation)
    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    // Should still show static content
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
    expect(screen.getAllByText("Articles")).toHaveLength(2); // Title and nav link

    // Should NOT show authenticated content
    expect(screen.queryByText("Welcome")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("shows authenticated user UI after hydration", async () => {
    const mockAuthStore = {
      user: { id: "1", email: "test@example.com", name: "Test User" },
      isAuthenticated: true,
      isLoading: false
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockAuthStore);

    render(<AuthHeader />);

    // Wait for component to mount (hydration simulation)
    await waitFor(() => {
      expect(screen.getByText("Welcome, Test User")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    // Should still show static content
    expect(screen.getByText("Jiki Learn")).toBeInTheDocument();

    // Should NOT show anonymous content
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });

  it("shows navigation links consistently", () => {
    const mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockAuthStore);

    render(<AuthHeader />);

    // Navigation links should always be present (static content)
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
  });
});
