import type { LessonDisplayData } from "@/components/dashboard/exercise-path/types";
import { WalkthroughCard } from "@/components/dashboard/exercise-path/ui/WalkthroughCard";
import { showVideoWalkthrough } from "@/lib/modal/app";
import { act, fireEvent, render } from "@testing-library/react";

jest.mock("@/lib/modal/app", () => ({
  showVideoWalkthrough: jest.fn()
}));

const mockShowVideoWalkthrough = showVideoWalkthrough as jest.Mock;

function createLesson(overrides?: Partial<LessonDisplayData>): LessonDisplayData {
  return {
    lesson: {
      slug: "maze-solve-basic",
      title: "Test Lesson",
      description: "Test description",
      type: "exercise"
    },
    completed: true,
    locked: false,
    route: "/test",
    deepDiveVideo: { provider: "mux", id: "playback-id", durationSeconds: 120, uploadDate: "2026-01-01" },
    deepDiveVideoWatchedPercentage: 0,
    ...overrides
  };
}

function renderCard(lesson = createLesson()) {
  const { container } = render(<WalkthroughCard lesson={lesson} />);
  const card = container.querySelector("[data-walkthrough-card]") as HTMLElement;
  return { card };
}

function reportProgress(percentage: number) {
  const { onProgress } = mockShowVideoWalkthrough.mock.calls[0][0];
  act(() => {
    onProgress(percentage);
  });
}

describe("WalkthroughCard", () => {
  beforeEach(() => {
    mockShowVideoWalkthrough.mockClear();
  });

  it("opens the walkthrough modal with a progress callback", () => {
    const { card } = renderCard();

    fireEvent.click(card);

    expect(mockShowVideoWalkthrough).toHaveBeenCalledWith({
      video: { provider: "mux", id: "playback-id", durationSeconds: 120, uploadDate: "2026-01-01" },
      lessonSlug: "maze-solve-basic",
      onProgress: expect.any(Function)
    });
  });

  it("turns watched as soon as the modal reports 100%, without a refetch", () => {
    const { card } = renderCard();
    expect(card.className).toContain("unwatched");

    fireEvent.click(card);
    reportProgress(100);

    expect(card.className).toContain("watched");
    expect(card.className).not.toContain("unwatched");
  });

  it("shows partial progress reported by the modal", () => {
    const { card } = renderCard();

    fireEvent.click(card);
    reportProgress(40);

    expect(card.className).toContain("watching");
    expect(card.querySelector<HTMLElement>("[style]")?.style.width).toBe("40%");
  });

  it("never regresses below already-reported or server-known progress", () => {
    const { card } = renderCard(createLesson({ deepDiveVideoWatchedPercentage: 30 }));

    fireEvent.click(card);
    reportProgress(60);
    reportProgress(10);

    expect(card.querySelector<HTMLElement>("[style]")?.style.width).toBe("60%");
  });
});
