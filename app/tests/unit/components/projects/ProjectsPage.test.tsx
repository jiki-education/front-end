import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ProjectsPage from "@/app/projects/page";
import { fetchProjects } from "@/lib/api/projects";
import { useRequireAuth } from "@/lib/auth/hooks";
import type { User } from "@/types/auth";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/projects", () => ({
  fetchProjects: jest.fn()
}));

jest.mock("@/lib/auth/hooks", () => ({
  useRequireAuth: jest.fn()
}));

jest.mock("@/components/index-page/sidebar/Sidebar", () => {
  return function MockSidebar({ activeItem }: { activeItem: string }) {
    return <div data-testid="sidebar">Sidebar - {activeItem}</div>;
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;
const mockUseRequireAuth = useRequireAuth as jest.MockedFunction<typeof useRequireAuth>;

describe("ProjectsPage", () => {
  const mockUser: User = {
    id: 1,
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    created_at: "2023-01-01T00:00:00Z",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    } as any);
  });

  it("should show loading state initially", () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      isReady: false,
      user: null
    });

    render(<ProjectsPage />);

    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
  });

  it("should return null when not authenticated", async () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isReady: true,
      user: null
    });

    const { container } = render(<ProjectsPage />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("should render projects page with sidebar", async () => {
    const mockProjects = {
      results: [
        {
          slug: "project-1",
          title: "Project 1",
          description: "First project",
          status: "unlocked" as const
        },
        {
          slug: "project-2",
          title: "Project 2",
          description: "Second project",
          status: "locked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 2,
        total_pages: 1
      }
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });

    expect(screen.getByTestId("sidebar")).toHaveTextContent("Sidebar - projects");
    expect(screen.getByText(/Build real applications and games to practice your coding skills/)).toBeInTheDocument();
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
  });

  it("should show message when no projects available", async () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProjects.mockResolvedValue({
      results: [],
      meta: {
        current_page: 1,
        total_count: 0,
        total_pages: 1
      }
    });

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("No projects available yet.")).toBeInTheDocument();
    });
  });

  it("should show error state when fetch fails", async () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProjects.mockRejectedValue(new Error("Failed to fetch"));

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
    });

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should render locked project as disabled", async () => {
    const mockProjects = {
      results: [
        {
          slug: "locked-project",
          title: "Locked Project",
          description: "This project is locked",
          status: "locked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 1,
        total_pages: 1
      }
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("Locked Project")).toBeInTheDocument();
    });

    // The outer card div has the disabled styling classes
    const projectCard = screen.getByText("Locked Project").closest("div")?.parentElement;
    expect(projectCard).toHaveClass("cursor-not-allowed", "opacity-60");
  });

  it("should render unlocked project as clickable", async () => {
    const mockProjects = {
      results: [
        {
          slug: "unlocked-project",
          title: "Unlocked Project",
          description: "This project is unlocked",
          status: "unlocked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 1,
        total_pages: 1
      }
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("Unlocked Project")).toBeInTheDocument();
    });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/projects/unlocked-project");
  });
});
