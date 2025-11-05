import Dashboard from "@/app/(app)/dashboard/page";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { useAuthStore } from "@/stores/authStore";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
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

// Mock DOM APIs for theme provider
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

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

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

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

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

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

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Jiki Learn")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("Articles")).toBeInTheDocument();
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

    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
