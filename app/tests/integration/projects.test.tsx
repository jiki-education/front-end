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
    return (
      <div data-testid="sidebar">
        <nav>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/dashboard">Exercises</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/projects" data-active={activeItem === "projects"}>
            Projects
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/blog">Blog</a>
        </nav>
      </div>
    );
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;
const mockUseRequireAuth = useRequireAuth as jest.MockedFunction<typeof useRequireAuth>;

describe("Projects Integration", () => {
  const mockPush = jest.fn();
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    created_at: "2023-01-01T00:00:00Z",
    membership_type: "standard"
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    } as any);

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });
  });

  it("should display projects with different status states", async () => {
    const mockProjects = {
      results: [
        {
          slug: "beginner-project",
          title: "Beginner Project",
          description: "Start here - learn the basics",
          status: "unlocked" as const
        },
        {
          slug: "intermediate-project",
          title: "Intermediate Project",
          description: "More challenging exercises",
          status: "started" as const
        },
        {
          slug: "advanced-project",
          title: "Advanced Project",
          description: "Complex algorithms and data structures",
          status: "completed" as const
        },
        {
          slug: "expert-project",
          title: "Expert Project",
          description: "Master-level challenges",
          status: "locked" as const
        }
      ],
      meta: {
        current_page: 1,
        total_count: 4,
        total_pages: 1
      }
    };

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    });

    // Check that all projects are displayed
    expect(screen.getByText("Beginner Project")).toBeInTheDocument();
    expect(screen.getByText("Intermediate Project")).toBeInTheDocument();
    expect(screen.getByText("Advanced Project")).toBeInTheDocument();
    expect(screen.getByText("Expert Project")).toBeInTheDocument();

    // Check status badges
    expect(screen.getByText("unlocked")).toBeInTheDocument();
    expect(screen.getByText("started")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("locked")).toBeInTheDocument();

    // Check that unlocked, started, and completed projects are clickable
    const unlockedProject = screen.getByText("Beginner Project").closest("a");
    const startedProject = screen.getByText("Intermediate Project").closest("a");
    const completedProject = screen.getByText("Advanced Project").closest("a");
    const lockedProjectCard = screen.getByText("Expert Project").closest("div")?.parentElement;

    expect(unlockedProject).toHaveAttribute("href", "/projects/beginner-project");
    expect(startedProject).toHaveAttribute("href", "/projects/intermediate-project");
    expect(completedProject).toHaveAttribute("href", "/projects/advanced-project");

    // Locked project should not be a link and have disabled styling
    expect(lockedProjectCard).not.toHaveAttribute("href");
    expect(lockedProjectCard).toHaveClass("cursor-not-allowed", "opacity-60");
  });

  it("should show active state in sidebar", async () => {
    mockFetchProjects.mockResolvedValue({
      results: [],
      meta: {
        current_page: 1,
        total_count: 0,
        total_pages: 1
      }
    });

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    const projectsLink = screen.getByRole("link", { name: "Projects" });
    expect(projectsLink).toHaveAttribute("data-active", "true");
  });

  it("should handle retry on error", async () => {
    // Mock fetch to fail
    mockFetchProjects.mockRejectedValueOnce(new Error("Network error"));

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });

    // Retry button should be present
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should maintain responsive grid layout", async () => {
    // Reset mocks to avoid interference from previous tests
    mockFetchProjects.mockReset();

    const mockProjects = {
      results: Array.from({ length: 6 }, (_, i) => ({
        slug: `project-${i + 1}`,
        title: `Project ${i + 1}`,
        description: `Description for project ${i + 1}`,
        status: "unlocked" as const
      })),
      meta: {
        current_page: 1,
        total_count: 6,
        total_pages: 1
      }
    };

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(
      () => {
        expect(screen.getByText("Project 1")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check that the grid container has correct classes
    // The grid container should contain the project cards
    const gridContainer = screen.getByText("Project 1").closest("a")?.parentElement;
    expect(gridContainer).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6");
  });
});
