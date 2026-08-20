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
  default: ({
    onReady,
    isCompleted,
    video,
    walkthroughVideo
  }: {
    onReady: () => void;
    isCompleted: boolean;
    video?: { id: string };
    walkthroughVideo?: { id: string };
  }) => {
    onReady();
    return (
      <div
        data-testid="lesson-content"
        data-completed={String(isCompleted)}
        data-video={video?.id ?? "none"}
        data-walkthrough={walkthroughVideo?.id ?? "none"}
      />
    );
  }
}));

jest.mock("@/lib/api/videos", () => ({
  fetchVideoIndex: jest.fn()
}));

jest.mock("@/components/common/LessonLoadingModal/LessonLoadingModal", () => ({
  __esModule: true,
  default: () => <div data-testid="lesson-loading" />
}));

import { fetchVideoIndex } from "@/lib/api/videos";
import { fetchLesson, startLesson } from "@/lib/api/lessons";
import { fetchUserCourse } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";

const mockedFetchLesson = fetchLesson as jest.MockedFunction<typeof fetchLesson>;
const mockedStartLesson = startLesson as jest.MockedFunction<typeof startLesson>;
const mockedFetchUserCourse = fetchUserCourse as jest.MockedFunction<typeof fetchUserCourse>;
const mockedFetchVideoIndex = fetchVideoIndex as jest.MockedFunction<typeof fetchVideoIndex>;

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

  it("shows the error screen for a non-422 failure", async () => {
    mockedStartLesson.mockRejectedValue(new ApiError(500, "Internal Server Error"));

    render(<Lesson slug={SLUG} />);

    // The LessonError screen (with its "Back to Dashboard" button) renders in place.
    await waitFor(() => expect(screen.getByText("Back to Dashboard")).toBeInTheDocument());
    expect(screen.queryByTestId("lesson-content")).not.toBeInTheDocument();
  });

  it("redirects to the dashboard instead of showing the error screen on a 422", async () => {
    // jsdom can't intercept the `window.location.href` hard navigation (it logs
    // "Not implemented: navigation" and no-ops), so assert the observable outcome:
    // the LessonError screen is NOT rendered because the catch block redirects and
    // returns before setError runs.
    mockedStartLesson.mockRejectedValue(new ApiError(422, "Unprocessable Entity"));

    render(<Lesson slug={SLUG} />);

    await waitFor(() => expect(screen.getByTestId("lesson-loading")).toBeInTheDocument());
    expect(screen.queryByText("Back to Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lesson-content")).not.toBeInTheDocument();
  });
});

/**
 * Which prop the resolved video arrives in is decided by the lesson's TYPE, and
 * getting that wrong is silent: the player renders its "no video" placeholder
 * and nothing throws.
 *
 * `choose_language` is the case that matters most and is easiest to forget. The
 * course opens with `welcome-to-coding-fundamentals`, which is a language picker
 * AND a video lesson, so gating the video prop on `type === "video"` blanks the
 * very first video a student ever sees.
 */
describe("Lesson routes the resolved video by lesson type", () => {
  const VIDEO_ID = "resolved-playback-id";

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchUserCourse.mockResolvedValue({ language: "javascript" } as unknown as Awaited<
      ReturnType<typeof fetchUserCourse>
    >);
    mockedStartLesson.mockResolvedValue(userLesson());
    mockedFetchVideoIndex.mockResolvedValue({
      sources: { [SLUG]: { provider: "mux", id: VIDEO_ID, durationSeconds: 10, uploadDate: "2026-01-01" } },
      refs: {}
    });
  });

  async function renderWithType(type: string) {
    mockedFetchLesson.mockResolvedValue({ slug: SLUG, type } as unknown as Awaited<ReturnType<typeof fetchLesson>>);
    render(<Lesson slug={SLUG} />);
    return waitFor(() => screen.getByTestId("lesson-content"));
  }

  it.each(["video", "choose_language"])("gives a %s lesson the video to play", async (type) => {
    const content = await renderWithType(type);
    expect(content).toHaveAttribute("data-video", VIDEO_ID);
    expect(content).toHaveAttribute("data-walkthrough", "none");
  });

  it("gives an exercise the same video as a walkthrough instead", async () => {
    const content = await renderWithType("exercise");
    expect(content).toHaveAttribute("data-walkthrough", VIDEO_ID);
    expect(content).toHaveAttribute("data-video", "none");
  });

  it("passes nothing when the lesson names no video", async () => {
    mockedFetchVideoIndex.mockResolvedValue({ sources: {}, refs: {} });
    const content = await renderWithType("video");
    expect(content).toHaveAttribute("data-video", "none");
  });
});
