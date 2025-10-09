import { render, screen, waitFor } from "@testing-library/react";
import { useAuthStore } from "@/stores/authStore";
import Home from "@/app/(external)/page";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/"
    };
  }
}));

// Mock the auth store
jest.mock("@/stores/authStore");

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it("renders loading state while checking auth", () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      hasCheckedAuth: false,
      checkAuth: mockCheckAuth
    });

    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows landing page when not authenticated", async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Welcome to Jiki")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });
  });

  it("redirects to dashboard when authenticated", async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth
    });

    render(<Home />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays feature cards on landing page", async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Interactive Learning")).toBeInTheDocument();
      expect(screen.getByText("Track Progress")).toBeInTheDocument();
      expect(screen.getByText("Real Projects")).toBeInTheDocument();
    });
  });
});
