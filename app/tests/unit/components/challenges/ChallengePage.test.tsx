import Challenge from "@/components/challenge/Challenge";
import { fetchChallenge, fetchUserChallenge, startChallenge } from "@/lib/api/challenges";
import { ApiError, NotFoundError } from "@/lib/api/client";
import { fetchUserCourse } from "@/lib/api/courses";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

// The page resolves display copy from the curriculum catalog during its load
// phase, so supply one here rather than letting the fallback silently stand in.
jest.mock("@/lib/api/curriculum-copy", () => {
  const actual = jest.requireActual("@/lib/api/curriculum-copy");
  return {
    ...actual,
    fetchCurriculumCopy: jest.fn().mockResolvedValue({
      "structured-house": { title: "Structured House", description: "Position every piece with variables." },
      checkerboard: { title: "Checkerboard", description: "Draw a checkerboard of any size." },
      "rainbow-ball": { title: "Rainbow Ball", description: "Bounce a colour-shifting ball." }
    })
  };
});

jest.mock("@/lib/api/challenges", () => ({
  fetchChallenge: jest.fn(),
  fetchUserChallenge: jest.fn(),
  startChallenge: jest.fn()
}));

jest.mock("@/lib/api/courses", () => ({
  fetchUserCourse: jest.fn()
}));

jest.mock("@/components/coding-exercise/CodingExercise", () => {
  return function MockCodingExercise({ context, isCompleted, serverSubmission }: any) {
    return (
      <div data-testid="coding-exercise">
        Exercise: {context.slug}, Context: {context.type}/{context.slug}, Completed: {String(isCompleted)}, Submission:{" "}
        {serverSubmission ? "yes" : "no"}
      </div>
    );
  };
});

const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFetchChallenge = fetchChallenge as jest.MockedFunction<typeof fetchChallenge>;
const mockFetchUserChallenge = fetchUserChallenge as jest.MockedFunction<typeof fetchUserChallenge>;
const mockStartChallenge = startChallenge as jest.MockedFunction<typeof startChallenge>;
const mockFetchUserCourse = fetchUserCourse as jest.MockedFunction<typeof fetchUserCourse>;

describe("Challenge", () => {
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

    mockStartChallenge.mockResolvedValue(undefined);
  });

  it("renders the coding exercise for an unlocked challenge", async () => {
    mockFetchChallenge.mockResolvedValue({
      slug: "structured-house"
    });
    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "structured-house",
      status: "started",
      conversation: [],
      conversation_allowed: true
    });

    render(<Challenge slug="structured-house" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: structured-house, Context: challenge/structured-house, Completed: false, Submission: no"
    );
    expect(mockStartChallenge).toHaveBeenCalledWith("structured-house");
  });

  it("shows the locked screen when /start rejects with challenge_locked", async () => {
    mockStartChallenge.mockRejectedValue(new ApiError(403, "Forbidden", { error: { type: "challenge_locked" } }));

    render(<Challenge slug="acronym" />);

    await waitFor(() => {
      expect(screen.getByText("Challenge Locked")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("coding-exercise")).not.toBeInTheDocument();
  });

  it("shows the premium screen when /start rejects with premium_required", async () => {
    mockStartChallenge.mockRejectedValue(new ApiError(403, "Forbidden", { error: { type: "premium_required" } }));

    render(<Challenge slug="premium-challenge" />);

    await waitFor(() => {
      expect(screen.getByText("Premium Required")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("coding-exercise")).not.toBeInTheDocument();
  });

  it("shows the error screen when /start fails with a non-403 error", async () => {
    mockStartChallenge.mockRejectedValue(new NotFoundError("Not Found", { error: { type: "challenge_not_found" } }));

    render(<Challenge slug="missing-challenge" />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("coding-exercise")).not.toBeInTheDocument();
  });

  it("shows the error screen when challenge content fails to load", async () => {
    mockFetchChallenge.mockRejectedValue(new Error("Boom"));
    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "structured-house",
      status: "started",
      conversation: [],
      conversation_allowed: true
    });

    render(<Challenge slug="structured-house" />);

    await waitFor(() => {
      expect(screen.getByText("Error: Boom")).toBeInTheDocument();
    });
  });

  it("treats a missing user_challenge record as a fresh, not-started challenge", async () => {
    mockFetchChallenge.mockResolvedValue({
      slug: "rainbow-ball"
    });
    mockFetchUserChallenge.mockRejectedValue(
      new NotFoundError("Not Found", { error: { type: "user_challenge_not_found" } })
    );

    render(<Challenge slug="rainbow-ball" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    // Falls back to the challenge slug as the exercise slug, not completed, no submission.
    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: rainbow-ball, Context: challenge/rainbow-ball, Completed: false, Submission: no"
    );
  });

  it("passes isCompleted and serverSubmission through for a completed challenge", async () => {
    mockFetchChallenge.mockResolvedValue({
      slug: "checkerboard"
    });
    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "checkerboard",
      status: "completed",
      conversation: [],
      conversation_allowed: true,
      data: {
        last_submission: {
          files: [{ filename: "solution.js", content: "console.log('done');" }]
        }
      }
    });

    render(<Challenge slug="checkerboard" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: checkerboard, Context: challenge/checkerboard, Completed: true, Submission: yes"
    );
  });
});
