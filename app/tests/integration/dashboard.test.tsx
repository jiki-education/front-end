import Dashboard from "@/app/(app)/dashboard/page";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { render, screen } from "@testing-library/react";

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

// Mock SVG imports
jest.mock("@static/icons/jiki-logo.svg", () => ({
  __esModule: true,
  default: () => <div data-testid="jiki-logo">Jiki</div>
}));

jest.mock("@static/icons/house.svg", () => ({
  __esModule: true,
  default: () => <div data-testid="house-icon" aria-hidden="true" />
}));

jest.mock("@static/icons/projects.svg", () => ({
  __esModule: true,
  default: () => <div data-testid="projects-icon" aria-hidden="true" />
}));

// Mock additional SVG icons that might be used
jest.mock("@static/icons/blog.svg", () => ({
  __esModule: true,
  default: () => <div data-testid="blog-icon" aria-hidden="true" />
}));

jest.mock("@static/icons/book.svg", () => ({
  __esModule: true,
  default: () => <div data-testid="book-icon" aria-hidden="true" />
}));

jest.mock("@static/icons/lightbulb.svg", () => ({
  __esModule: true,
  default: () => <div data-testid="lightbulb-icon" aria-hidden="true" />
}));

// Mock the auth store
const mockLogout = jest.fn().mockImplementation(() => {
  window.localStorage.removeItem("auth-storage");
  window.sessionStorage.clear();
});

jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: () => ({
    logout: mockLogout
  })
}));

// Mock the levels API
jest.mock("@/lib/api/levels", () => ({
  fetchLevelsWithProgress: jest.fn()
}));

// Mock AuthenticationError
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  AuthenticationError: class AuthenticationError extends Error {
    public status: number;
    public statusText: string;
    public data?: unknown;

    constructor(statusText: string, data?: unknown) {
      super(`API Error: 401 ${statusText}`);
      this.name = "AuthenticationError";
      this.status = 401;
      this.statusText = statusText;
      this.data = data;
    }
  }
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

Object.defineProperty(window, "sessionStorage", {
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
    mockLogout.mockClear();
    (fetchLevelsWithProgress as jest.Mock).mockResolvedValue(mockLevelsData);
  });

  it("renders without crashing", () => {
    const { container } = render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    // Should render some content (not null)
    expect(container.firstChild).not.toBeNull();
  });

  it("displays loading state while fetching levels", () => {
    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Note: Auth error handling is now done globally by GlobalErrorHandler
  // Auth errors cause promises to hang forever (not caught by components)
  // Test removed as component no longer handles auth errors directly
});
