import Dashboard from "@/app/dashboard/page";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { useAuthStore } from "@/stores/authStore";
import { render, screen, waitFor } from "@testing-library/react";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/dashboard",
      query: {},
      asPath: "/dashboard"
    };
  }
}));

// Mock the auth store
jest.mock("@/stores/authStore");

// Mock the levels API
jest.mock("@/lib/api/levels", () => ({
  fetchLevelsWithProgress: jest.fn()
}));

describe("Dashboard Page", () => {
  const mockLevelsData = [
    {
      slug: "getting-started",
      status: "in_progress",
      lessons: [
        { slug: "introduction", type: "video" },
        { slug: "variables", type: "exercise" }
      ],
      userProgress: {
        level_slug: "getting-started",
        user_lessons: [
          { lesson_slug: "introduction", status: "completed" },
          { lesson_slug: "variables", status: "in_progress" }
        ]
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    (fetchLevelsWithProgress as jest.Mock).mockResolvedValue(mockLevelsData);
  });

  it("redirects to login when not authenticated", async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    const mockState = {
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockState);
    (useAuthStore as any).getState = jest.fn().mockReturnValue(mockState);

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("renders dashboard when authenticated", async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    const mockState = {
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth,
      user: { id: "1", email: "test@test.com" }
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockState);
    (useAuthStore as any).getState = jest.fn().mockReturnValue(mockState);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  it("displays the navigation sidebar", async () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    const mockState = {
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth,
      user: { id: "1", email: "test@test.com" }
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockState);
    (useAuthStore as any).getState = jest.fn().mockReturnValue(mockState);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
      expect(screen.getByText("Exercises")).toBeInTheDocument();
    });
  });

  it("displays loading state while fetching levels", () => {
    const mockCheckAuth = jest.fn().mockResolvedValue(undefined);
    const mockState = {
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      checkAuth: mockCheckAuth,
      user: { id: "1", email: "test@test.com" }
    };
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockState);
    (useAuthStore as any).getState = jest.fn().mockReturnValue(mockState);

    render(<Dashboard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
