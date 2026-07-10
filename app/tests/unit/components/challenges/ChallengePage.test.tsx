import Challenge from "@/components/challenge/Challenge";
import { fetchChallenge, fetchUserChallenge, startChallenge } from "@/lib/api/challenges";
import { ApiError, NotFoundError } from "@/lib/api/client";
import { fetchUserCourse } from "@/lib/api/courses";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/lib/api/challenges", () => ({
  fetchChallenge: jest.fn(),
  fetchUserChallenge: jest.fn(),
  startChallenge: jest.fn()
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
      slug: "test-challenge",
      title: "Test Challenge",
      description: "A test challenge",
      exercise_slug: "test-exercise"
    });
    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "test-challenge",
      status: "started",
      conversation: [],
      conversation_allowed: true
    });

    render(<Challenge slug="test-challenge" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: test-exercise, Context: challenge/test-challenge, Completed: false, Submission: no"
    );
    expect(mockStartChallenge).toHaveBeenCalledWith("test-challenge");
  });

  it("shows the locked screen when /start rejects with challenge_locked", async () => {
    mockStartChallenge.mockRejectedValue(new ApiError(403, "Forbidden", { error: { type: "challenge_locked" } }));

    render(<Challenge slug="locked-challenge" />);

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
      challenge_slug: "test-challenge",
      status: "started",
      conversation: [],
      conversation_allowed: true
    });

    render(<Challenge slug="test-challenge" />);

    await waitFor(() => {
      expect(screen.getByText("Error: Boom")).toBeInTheDocument();
    });
  });

  it("treats a missing user_challenge record as a fresh, not-started challenge", async () => {
    mockFetchChallenge.mockResolvedValue({
      slug: "fresh-challenge",
      title: "Fresh Challenge",
      description: "Never started"
    });
    mockFetchUserChallenge.mockRejectedValue(
      new NotFoundError("Not Found", { error: { type: "user_challenge_not_found" } })
    );

    render(<Challenge slug="fresh-challenge" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    // Falls back to the challenge slug as the exercise slug, not completed, no submission.
    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: fresh-challenge, Context: challenge/fresh-challenge, Completed: false, Submission: no"
    );
  });

  it("passes isCompleted and serverSubmission through for a completed challenge", async () => {
    mockFetchChallenge.mockResolvedValue({
      slug: "done-challenge",
      title: "Done Challenge",
      description: "Completed",
      exercise_slug: "done-exercise"
    });
    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "done-challenge",
      status: "completed",
      conversation: [],
      conversation_allowed: true,
      data: {
        last_submission: {
          files: [{ filename: "solution.js", content: "console.log('done');" }]
        }
      }
    });

    render(<Challenge slug="done-challenge" />);

    await waitFor(() => {
      expect(screen.getByTestId("coding-exercise")).toBeInTheDocument();
    });

    expect(screen.getByTestId("coding-exercise")).toHaveTextContent(
      "Exercise: done-exercise, Context: challenge/done-challenge, Completed: true, Submission: yes"
    );
  });
});
