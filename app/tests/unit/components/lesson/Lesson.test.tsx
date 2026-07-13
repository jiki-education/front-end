import { render, waitFor } from "@testing-library/react";
import Lesson from "@/components/lesson/Lesson";

jest.mock("@/lib/api/lessons", () => ({
  fetchLesson: jest.fn(),
  fetchUserLesson: jest.fn(),
  startLesson: jest.fn()
}));

jest.mock("@/lib/api/courses", () => ({
  fetchUserCourse: jest.fn()
}));

jest.mock("@/lib/reportError", () => ({
  reportError: jest.fn()
}));

// Stub the dynamic child so the test focuses on Lesson's data/start logic and
// signals readiness immediately.
jest.mock("@/components/lesson/LessonContent", () => ({
  __esModule: true,
  default: ({ onReady }: { onReady: () => void }) => {
    onReady();
    return <div data-testid="lesson-content" />;
  }
}));

jest.mock("@/components/common/LessonLoadingModal/LessonLoadingModal", () => ({
  __esModule: true,
  default: () => <div data-testid="lesson-loading" />
}));

import { fetchLesson, fetchUserLesson, startLesson } from "@/lib/api/lessons";
import { fetchUserCourse } from "@/lib/api/courses";

const mockedFetchLesson = fetchLesson as jest.MockedFunction<typeof fetchLesson>;
const mockedFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;
const mockedStartLesson = startLesson as jest.MockedFunction<typeof startLesson>;
const mockedFetchUserCourse = fetchUserCourse as jest.MockedFunction<typeof fetchUserCourse>;

const SLUG = "if-statements";

describe("Lesson ensure-start on mount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchLesson.mockResolvedValue({ slug: SLUG, type: "video", title: "If Statements" } as unknown as Awaited<
      ReturnType<typeof fetchLesson>
    >);
    mockedFetchUserCourse.mockResolvedValue({ language: "javascript" } as unknown as Awaited<
      ReturnType<typeof fetchUserCourse>
    >);
    mockedStartLesson.mockResolvedValue(undefined);
  });

  it("starts the lesson when no UserLesson row exists yet", async () => {
    // A user arriving via a direct link / bookmark has no row, so fetchUserLesson 404s.
    mockedFetchUserLesson.mockRejectedValue(new Error("API Error: 404"));

    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(mockedStartLesson).toHaveBeenCalledWith(SLUG));
    expect(mockedStartLesson).toHaveBeenCalledTimes(1);
  });

  it("does not start the lesson when a UserLesson row already exists", async () => {
    mockedFetchUserLesson.mockResolvedValue({ status: "started" } as unknown as Awaited<
      ReturnType<typeof fetchUserLesson>
    >);

    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(mockedFetchLesson).toHaveBeenCalled());
    expect(mockedStartLesson).not.toHaveBeenCalled();
  });
});
