import ProjectsPage from "@/app/(app)/projects/page";
import { fetchProjects } from "@/lib/api/projects";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/projects", () => ({
  fetchProjects: jest.fn()
}));

jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: jest.fn(() => ({
    isAuthenticated: true,
    hasCheckedAuth: true
  }))
}));

jest.mock("@/components/layout/sidebar/Sidebar", () => {
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

describe("Projects Integration", () => {
  const mockPush = jest.fn();

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

    // Check that all projects are displayed (using more specific selectors to avoid duplicates)
    expect(screen.getAllByText("Beginner Project")).toHaveLength(2); // One in hero, one in content
    expect(screen.getAllByText("Intermediate Project")).toHaveLength(2);
    expect(screen.getAllByText("Advanced Project")).toHaveLength(2);
    expect(screen.getAllByText("Expert Project")).toHaveLength(2);

    // Check status badges (using updated display text)
    expect(screen.getAllByText("Not started").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("In Progress").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Locked").length).toBeGreaterThanOrEqual(1);

    // Check that unlocked, started, and completed projects are clickable
    const unlockedProject = screen.getAllByText("Beginner Project")[0].closest("a");
    const startedProject = screen.getAllByText("Intermediate Project")[0].closest("a");
    const completedProject = screen.getAllByText("Advanced Project")[0].closest("a");
    const lockedProjectCard = screen.getAllByText("Expert Project")[0].closest("div")?.parentElement;

    expect(unlockedProject).toHaveAttribute("href", "/projects/beginner-project");
    expect(startedProject).toHaveAttribute("href", "/projects/intermediate-project");
    expect(completedProject).toHaveAttribute("href", "/projects/advanced-project");

    // Locked project should not be a link (no <a> wrapper)
    expect(lockedProjectCard).not.toHaveAttribute("href");
    // The locked styling is applied via CSS data-state="locked", not classes
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
        expect(screen.getAllByText("Project 1")).toHaveLength(2); // One in hero, one in content
      },
      { timeout: 3000 }
    );

    // Check that the grid container has correct classes
    // The grid container should contain the project cards
    const gridContainer = screen.getAllByText("Project 1")[0].closest("a")?.parentElement;
    expect(gridContainer).toHaveClass("grid");
  });
});
