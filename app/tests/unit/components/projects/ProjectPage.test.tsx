import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ProjectPage from "@/app/projects/[slug]/page";
import { fetchProject } from "@/lib/api/projects";
import { useRequireAuth } from "@/lib/auth/hooks";
import type { User } from "@/types/auth";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/projects", () => ({
  fetchProject: jest.fn()
}));

jest.mock("@/lib/auth/hooks", () => ({
  useRequireAuth: jest.fn()
}));

jest.mock("@/components/coding-exercise/CodingExercise", () => {
  return function MockCodingExercise({ exerciseSlug, projectSlug, isProject }: any) {
    return (
      <div data-testid="coding-exercise">
        Exercise: {exerciseSlug}, Project: {projectSlug}, IsProject: {String(isProject)}
      </div>
    );
  };
});

jest.mock("@/components/lesson/LessonLoadingPage", () => {
  return function MockLessonLoadingPage({ type }: { type: string }) {
    return <div data-testid="loading-page">Loading - {type}</div>;
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchProject = fetchProject as jest.MockedFunction<typeof fetchProject>;
const mockUseRequireAuth = useRequireAuth as jest.MockedFunction<typeof useRequireAuth>;

describe("ProjectPage", () => {
  const mockPush = jest.fn();
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    created_at: "2023-01-01T00:00:00Z"
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
  });

  it("should show loading state initially", () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      isReady: false,
      user: null
    });

    const params = Promise.resolve({ slug: "test-project" });

    render(<ProjectPage params={params} />);

    expect(screen.getByTestId("loading-page")).toHaveTextContent("Loading - exercise");
  });

  it("should return null when not authenticated", async () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isReady: true,
      user: null
    });

    const params = Promise.resolve({ slug: "test-project" });

    const { container } = render(<ProjectPage params={params} />);

    // Wait for the component to finish loading
    await waitFor(
      () => {
        expect(container.firstChild).toBeNull();
      },
      { timeout: 3000 }
    );
  });

  it("should render coding exercise for unlocked project", async () => {
    const mockProject = {
      slug: "test-project",
      title: "Test Project",
      description: "A test project",
      status: "unlocked" as const,
      exercise_slug: "test-exercise"
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProject.mockResolvedValue(mockProject);

    const params = Promise.resolve({ slug: "test-project" });

    render(<ProjectPage params={params} />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: test-exercise, Project: test-project, IsProject: true"
    );
  });

  it("should show locked message for locked project", async () => {
    const mockProject = {
      slug: "locked-project",
      title: "Locked Project",
      description: "A locked project",
      status: "locked" as const
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProject.mockResolvedValue(mockProject);

    const params = Promise.resolve({ slug: "locked-project" });

    render(<ProjectPage params={params} />);

    await waitFor(() => {
      expect(screen.getByText("Project Locked")).toBeInTheDocument();
    });

    expect(
      screen.getByText("This project is currently locked. Complete previous lessons to unlock it.")
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Projects")).toBeInTheDocument();
  });

  it("should show error state when fetch fails", async () => {
    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProject.mockRejectedValue(new Error("Project not found"));

    const params = Promise.resolve({ slug: "invalid-project" });

    render(<ProjectPage params={params} />);

    await waitFor(() => {
      expect(screen.getByText("Error: Project not found")).toBeInTheDocument();
    });

    expect(screen.getByText("Back to Projects")).toBeInTheDocument();
  });

  it("should use project slug as exercise slug when exercise_slug not provided", async () => {
    const mockProject = {
      slug: "fallback-project",
      title: "Fallback Project",
      description: "A project without exercise_slug",
      status: "unlocked" as const
      // No exercise_slug provided
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProject.mockResolvedValue(mockProject);

    const params = Promise.resolve({ slug: "fallback-project" });

    render(<ProjectPage params={params} />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: fallback-project, Project: fallback-project, IsProject: true"
    );
  });

  it("should handle started project status", async () => {
    const mockProject = {
      slug: "started-project",
      title: "Started Project",
      description: "A project that's in progress",
      status: "started" as const,
      exercise_slug: "started-exercise"
    };

    mockUseRequireAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isReady: true,
      user: mockUser
    });

    mockFetchProject.mockResolvedValue(mockProject);

    const params = Promise.resolve({ slug: "started-project" });

    render(<ProjectPage params={params} />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: started-exercise, Project: started-project, IsProject: true"
    );
  });
});
