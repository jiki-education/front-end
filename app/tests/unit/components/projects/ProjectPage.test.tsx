import Project from "@/components/project/Project";
import { ApiError, NotFoundError } from "@/lib/api/client";
import { fetchUserCourse } from "@/lib/api/courses";
import { fetchProject, fetchUserProject, startProject } from "@/lib/api/projects";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/projects", () => ({
  fetchProject: jest.fn(),
  fetchUserProject: jest.fn(),
  startProject: jest.fn()
}));

jest.mock("@/lib/api/courses", () => ({
  fetchUserCourse: jest.fn()
}));

jest.mock("@/components/coding-exercise/CodingExercise", () => {
  return function MockCodingExercise({ exerciseSlug, context, isCompleted, serverSubmission }: any) {
    return (
      <div data-testid="coding-exercise">
        Exercise: {exerciseSlug}, Context: {context.type}/{context.slug}, Completed: {String(isCompleted)}, Submission:{" "}
        {serverSubmission ? "yes" : "no"}
      </div>
    );
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchProject = fetchProject as jest.MockedFunction<typeof fetchProject>;
const mockFetchUserProject = fetchUserProject as jest.MockedFunction<typeof fetchUserProject>;
const mockStartProject = startProject as jest.MockedFunction<typeof startProject>;
const mockFetchUserCourse = fetchUserCourse as jest.MockedFunction<typeof fetchUserCourse>;

describe("Project", () => {
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
    });

    mockFetchUserCourse.mockResolvedValue({
      course_slug: "coding-fundamentals",
      language: "javascript",
      language_chosen: true,
      current_level_slug: "variables",
      completed: false
    });

    mockStartProject.mockResolvedValue(undefined);
  });

  it("renders the coding exercise for an unlocked project", async () => {
    mockFetchProject.mockResolvedValue({
      slug: "test-project",
      title: "Test Project",
      description: "A test project",
      exercise_slug: "test-exercise"
    });
    mockFetchUserProject.mockResolvedValue({
      project_slug: "test-project",
      status: "started",
      conversation: [],
      conversation_allowed: true
    });

    render(<Project slug="test-project" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: test-exercise, Context: project/test-project, Completed: false, Submission: no"
    );
    expect(mockStartProject).toHaveBeenCalledWith("test-project");
  });

  it("shows the locked screen when /start rejects with project_locked", async () => {
    mockStartProject.mockRejectedValue(new ApiError(403, "Forbidden", { error: { type: "project_locked" } }));

    render(<Project slug="locked-project" />);

    await waitFor(() => {
      expect(screen.getByText("Project Locked")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("coding-exercise")).not.toBeInTheDocument();
  });

  it("shows the premium screen when /start rejects with premium_required", async () => {
    mockStartProject.mockRejectedValue(new ApiError(403, "Forbidden", { error: { type: "premium_required" } }));

    render(<Project slug="premium-project" />);

    await waitFor(() => {
      expect(screen.getByText("Premium Required")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("coding-exercise")).not.toBeInTheDocument();
  });

  it("shows the error screen when /start fails with a non-403 error", async () => {
    mockStartProject.mockRejectedValue(new NotFoundError("Not Found", { error: { type: "project_not_found" } }));

    render(<Project slug="missing-project" />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("coding-exercise")).not.toBeInTheDocument();
  });

  it("shows the error screen when project content fails to load", async () => {
    mockFetchProject.mockRejectedValue(new Error("Boom"));
    mockFetchUserProject.mockResolvedValue({
      project_slug: "test-project",
      status: "started",
      conversation: [],
      conversation_allowed: true
    });

    render(<Project slug="test-project" />);

    await waitFor(() => {
      expect(screen.getByText("Error: Boom")).toBeInTheDocument();
    });
  });

  it("treats a missing user_project record as a fresh, not-started project", async () => {
    mockFetchProject.mockResolvedValue({
      slug: "fresh-project",
      title: "Fresh Project",
      description: "Never started"
    });
    mockFetchUserProject.mockRejectedValue(
      new NotFoundError("Not Found", { error: { type: "user_project_not_found" } })
    );

    render(<Project slug="fresh-project" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    // Falls back to the project slug as the exercise slug, not completed, no submission.
    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: fresh-project, Context: project/fresh-project, Completed: false, Submission: no"
    );
  });

  it("passes isCompleted and serverSubmission through for a completed project", async () => {
    mockFetchProject.mockResolvedValue({
      slug: "done-project",
      title: "Done Project",
      description: "Completed",
      exercise_slug: "done-exercise"
    });
    mockFetchUserProject.mockResolvedValue({
      project_slug: "done-project",
      status: "completed",
      conversation: [],
      conversation_allowed: true,
      data: {
        last_submission: {
          files: [{ filename: "solution.js", content: "console.log('done');" }]
        }
      }
    });

    render(<Project slug="done-project" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: done-exercise, Context: project/done-project, Completed: true, Submission: yes"
    );
  });
});
