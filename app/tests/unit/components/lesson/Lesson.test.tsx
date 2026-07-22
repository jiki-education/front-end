import { render, screen, waitFor } from "@testing-library/react";
import Lesson from "@/components/lesson/Lesson";

jest.mock("@/lib/api/lessons", () => ({
  fetchLesson: jest.fn(),
  startLesson: jest.fn()
}));

jest.mock("@/lib/api/courses", () => ({
  fetchUserCourse: jest.fn()
}));

// Stub the dynamic child so the test focuses on Lesson's data/start logic and
// signals readiness immediately. It also exposes the isCompleted prop it receives.
jest.mock("@/components/lesson/LessonContent", () => ({
  __esModule: true,
  default: ({ onReady, isCompleted }: { onReady: () => void; isCompleted: boolean }) => {
    onReady();
    return <div data-testid="lesson-content" data-completed={String(isCompleted)} />;
  }
}));

jest.mock("@/components/common/LessonLoadingModal/LessonLoadingModal", () => ({
  __esModule: true,
  default: () => <div data-testid="lesson-loading" />
}));

import { fetchLesson, startLesson } from "@/lib/api/lessons";
import { fetchUserCourse } from "@/lib/api/courses";

const mockedFetchLesson = fetchLesson as jest.MockedFunction<typeof fetchLesson>;
const mockedStartLesson = startLesson as jest.MockedFunction<typeof startLesson>;
const mockedFetchUserCourse = fetchUserCourse as jest.MockedFunction<typeof fetchUserCourse>;

const SLUG = "if-statements";

function userLesson(overrides: Record<string, unknown> = {}) {
  return { lesson_slug: SLUG, status: "started", data: {}, ...overrides } as unknown as Awaited<
    ReturnType<typeof startLesson>
  >;
}

describe("Lesson starts the lesson on mount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchLesson.mockResolvedValue({ slug: SLUG, type: "video", title: "If Statements" } as unknown as Awaited<
      ReturnType<typeof fetchLesson>
    >);
    mockedFetchUserCourse.mockResolvedValue({ language: "javascript" } as unknown as Awaited<
      ReturnType<typeof fetchUserCourse>
    >);
    mockedStartLesson.mockResolvedValue(userLesson());
  });

  it("calls startLesson (idempotent, single request) for every entry path", async () => {
    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(mockedStartLesson).toHaveBeenCalledWith(SLUG));
    expect(mockedStartLesson).toHaveBeenCalledTimes(1);
  });

  it("marks the lesson completed when start returns a completed user lesson", async () => {
    mockedStartLesson.mockResolvedValue(userLesson({ status: "completed" }));

    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(screen.getByTestId("lesson-content")).toHaveAttribute("data-completed", "true"));
  });

  it("is not completed when start returns a started user lesson", async () => {
    mockedStartLesson.mockResolvedValue(userLesson({ status: "started" }));

    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(screen.getByTestId("lesson-content")).toHaveAttribute("data-completed", "false"));
  });

  it("shows an error when start fails", async () => {
    mockedStartLesson.mockRejectedValue(new Error("API Error: 422"));

    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(screen.queryByTestId("lesson-content")).not.toBeInTheDocument());
  });
});
