import ExercisePath from "@/components/dashboard/exercise-path/ExercisePath";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { toastError } from "@/lib/toast";
import type { LessonWithProgress, LevelWithProgress } from "@/types/levels";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/api/levels", () => ({
  fetchLevelsWithProgress: jest.fn()
}));

jest.mock("@/lib/api/lessons", () => ({
  startLesson: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("@/lib/constants/course", () => ({
  CURRENT_COURSE_SLUG: "coding-fundamentals",
  LAST_PUBLISHED_LEVEL_SLUG: "level-cutoff"
}));

jest.mock("@/lib/toast", () => ({
  toastError: jest.fn()
}));

const mockFetchLevels = fetchLevelsWithProgress as jest.MockedFunction<typeof fetchLevelsWithProgress>;
const mockToastError = toastError as jest.MockedFunction<typeof toastError>;

function createLesson(overrides: Partial<LessonWithProgress> = {}): LessonWithProgress {
  return {
    slug: "lesson-one",
    title: "Lesson One",
    type: "exercise",
    description: "A lesson",
    status: "not_started",
    walkthrough_video_data: null,
    walkthrough_video_watched_percentage: 0,
    ...overrides
  };
}

function createLevel(slug: string, lessons: LessonWithProgress[] = []): LevelWithProgress {
  return {
    slug,
    status: "not_started",
    lessons
  };
}

describe("ExercisePath", () => {
  beforeAll(() => {
    // jsdom doesn't implement scrollIntoView; the active-lesson scroll effect calls it.
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, "", "/dashboard");
  });

  it("shows an error toast and strips the param when arriving with ?lessonError", async () => {
    mockFetchLevels.mockResolvedValue([createLevel("level-cutoff", [createLesson({ slug: "l1" })])]);
    window.history.replaceState({}, "", "/dashboard?lessonError=1");

    render(<ExercisePath />);

    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith("lesson.loadFailed"));
    expect(new URLSearchParams(window.location.search).has("lessonError")).toBe(false);
  });

  it("does not show an error toast on a normal dashboard visit", async () => {
    mockFetchLevels.mockResolvedValue([createLevel("level-cutoff", [createLesson({ slug: "l1" })])]);
    window.history.replaceState({}, "", "/dashboard");

    render(<ExercisePath />);

    await waitFor(() => expect(mockFetchLevels).toHaveBeenCalled());
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("renders the ComingSoonCard when all lessons in the cutoff level are completed", async () => {
    mockFetchLevels.mockResolvedValue([
      createLevel("level-cutoff", [
        createLesson({ slug: "l1", status: "completed" }),
        createLesson({ slug: "l2", status: "completed" })
      ]),
      createLevel("level-after", [createLesson({ slug: "l3", status: "not_started" })])
    ]);

    render(<ExercisePath />);

    expect(await screen.findByText("More Lessons Coming Soon")).toBeInTheDocument();
    expect(screen.queryByText("Completion Certificate")).not.toBeInTheDocument();
  });

  it("renders the CompletionCert when the cutoff level still has incomplete lessons", async () => {
    mockFetchLevels.mockResolvedValue([
      createLevel("level-cutoff", [
        createLesson({ slug: "l1", status: "completed" }),
        createLesson({ slug: "l2", status: "started" })
      ]),
      createLevel("level-after", [createLesson({ slug: "l3", status: "not_started" })])
    ]);

    render(<ExercisePath />);

    await waitFor(() => {
      expect(screen.getByText("Completion Certificate")).toBeInTheDocument();
    });
    expect(screen.queryByText("More Lessons Coming Soon")).not.toBeInTheDocument();
  });
});
