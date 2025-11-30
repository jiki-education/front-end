import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ProjectsPage from "@/app/projects/page";
import { fetchProjects } from "@/lib/api/projects";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/projects", () => ({
  fetchProjects: jest.fn()
}));

jest.mock("@/components/layout/sidebar/Sidebar", () => {
  return function MockSidebar({ activeItem }: { activeItem: string }) {
    return <div data-testid="sidebar">Sidebar - {activeItem}</div>;
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;

describe("ProjectsPage", () => {
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

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });

    expect(screen.getByTestId("sidebar")).toHaveTextContent("Sidebar - projects");
    expect(screen.getByText(/Build real applications and games to practice your coding skills/)).toBeInTheDocument();
    expect(screen.getAllByText("Project 1")).toHaveLength(2); // One in hero, one in content
    expect(screen.getAllByText("Project 2")).toHaveLength(2);
  });

  it("should show message when no projects available", async () => {
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

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Locked Project")).toHaveLength(2); // One in hero, one in content
    });

    // The locked project should not be wrapped in a link
    const projectCard = screen.getAllByText("Locked Project")[0].closest("div");
    expect(projectCard).not.toHaveAttribute("href");
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

    mockFetchProjects.mockResolvedValue(mockProjects);

    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Unlocked Project")).toHaveLength(2); // One in hero, one in content
    });

    const link = screen.getAllByRole("link").find((link) => link.getAttribute("href") === "/projects/unlocked-project");
    expect(link).toHaveAttribute("href", "/projects/unlocked-project");
  });
});
