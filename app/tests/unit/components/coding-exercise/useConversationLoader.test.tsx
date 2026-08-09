import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";
import type { ExerciseContext } from "@/components/coding-exercise/lib/types";
import { useConversationLoader } from "@/components/coding-exercise/lib/useConversationLoader";
import { fetchUserChallenge } from "@/lib/api/challenges";
import { NotFoundError } from "@/lib/api/client";
import { fetchUserLesson } from "@/lib/api/lessons";
import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("@/lib/api/lessons");
jest.mock("@/lib/api/challenges");
const mockFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;
const mockFetchUserChallenge = fetchUserChallenge as jest.MockedFunction<typeof fetchUserChallenge>;

const lessonContext: ExerciseContext = { type: "lesson", slug: "maze-solve-basic" };
const challengeContext: ExerciseContext = { type: "challenge", slug: "structured-house" };

describe("useConversationLoader", () => {
  beforeEach(() => {
    mockFetchUserLesson.mockClear();
    mockFetchUserChallenge.mockClear();
    // Clear console.warn to avoid cluttering test output
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should load conversation successfully", async () => {
    const mockConversation: ChatMessage[] = [
      { role: "user", content: "Hello", timestamp: "2023-01-01T00:00:00Z" },
      { role: "assistant", content: "Hi there!", timestamp: "2023-01-01T00:00:01Z" }
    ];

    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "maze-solve-basic",
      status: "started",
      conversation: mockConversation,
      conversation_allowed: true,
      data: {}
    });

    const { result } = renderHook(() => useConversationLoader(lessonContext));

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.conversation).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the load to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation);
    expect(result.current.conversationAllowed).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockFetchUserLesson).toHaveBeenCalledWith("maze-solve-basic");
  });

  it("should load challenge conversations via fetchUserChallenge", async () => {
    const mockConversation: ChatMessage[] = [{ role: "user", content: "Challenge question" }];

    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "structured-house",
      status: "started",
      conversation: mockConversation,
      conversation_allowed: true
    });

    const { result } = renderHook(() => useConversationLoader(challengeContext));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation);
    expect(mockFetchUserChallenge).toHaveBeenCalledWith("structured-house");
    expect(mockFetchUserLesson).not.toHaveBeenCalled();
  });

  it("should treat NotFoundError as a fresh, empty, allowed conversation", async () => {
    mockFetchUserLesson.mockRejectedValue(new NotFoundError("Not Found"));

    const { result } = renderHook(() => useConversationLoader({ type: "lesson", slug: "maze-solve-basic" }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual([]);
    expect(result.current.conversationAllowed).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fail closed when an existing record has conversation_allowed false", async () => {
    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "maze-solve-basic",
      status: "started",
      conversation: [],
      conversation_allowed: false,
      data: {}
    });

    const { result } = renderHook(() => useConversationLoader(lessonContext));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversationAllowed).toBe(false);
  });

  it("should fail closed when an existing record omits conversation_allowed", async () => {
    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "maze-solve-basic",
      status: "started",
      conversation: []
      // conversation_allowed intentionally omitted (backend may not emit it yet)
    } as never);

    const { result } = renderHook(() => useConversationLoader(lessonContext));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversationAllowed).toBe(false);
  });

  it("should handle API errors", async () => {
    mockFetchUserLesson.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useConversationLoader(lessonContext));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual([]);
    expect(result.current.error).toBe("Network error");
  });

  it("should handle empty context slug", async () => {
    // Slugs are a literal union now, so an empty slug is unrepresentable in the
    // types. The runtime guard still matters (the API is not type-checked), so
    // construct the invalid state deliberately to prove the guard holds.
    const emptySlugContext = { type: "lesson", slug: "" } as unknown as ExerciseContext;
    const { result } = renderHook(() => useConversationLoader(emptySlugContext));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockFetchUserLesson).not.toHaveBeenCalled();
  });

  it("should cache results and not refetch on subsequent calls", async () => {
    const mockConversation: ChatMessage[] = [{ role: "user", content: "Cached message" }];

    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "maze-solve-basic",
      status: "started",
      conversation: mockConversation,
      conversation_allowed: true,
      data: {}
    });

    const cachedContext: ExerciseContext = { type: "lesson", slug: "maze-solve-basic" };
    const { result, rerender } = renderHook(({ context }) => useConversationLoader(context), {
      initialProps: { context: cachedContext }
    });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);

    // Rerender with an equivalent context (same type + slug)
    rerender({ context: { type: "lesson", slug: "maze-solve-basic" } });

    // Should not call API again
    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);
    expect(result.current.conversation).toEqual(mockConversation);
  });

  it("should key the cache by context type, reloading when it changes", async () => {
    const lessonConversation: ChatMessage[] = [{ role: "user", content: "Lesson message" }];
    const challengeConversation: ChatMessage[] = [{ role: "user", content: "Challenge message" }];

    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "maze-solve-basic",
      status: "started",
      conversation: lessonConversation,
      conversation_allowed: true,
      data: {}
    });
    mockFetchUserChallenge.mockResolvedValue({
      challenge_slug: "structured-house",
      status: "started",
      conversation: challengeConversation,
      conversation_allowed: true
    });

    const { result, rerender } = renderHook(({ context }) => useConversationLoader(context), {
      initialProps: { context: { type: "lesson", slug: "maze-solve-basic" } as ExerciseContext }
    });

    await waitFor(() => {
      expect(result.current.conversation).toEqual(lessonConversation);
    });

    rerender({ context: { type: "challenge", slug: "structured-house" } as ExerciseContext });

    await waitFor(() => {
      expect(result.current.conversation).toEqual(challengeConversation);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);
    expect(mockFetchUserChallenge).toHaveBeenCalledTimes(1);
  });

  it("should reload when a different context slug is provided", async () => {
    const mockConversation1: ChatMessage[] = [{ role: "user", content: "Exercise 1 message" }];
    const mockConversation2: ChatMessage[] = [{ role: "user", content: "Exercise 2 message" }];

    mockFetchUserLesson
      .mockResolvedValueOnce({
        lesson_slug: "maze-solve-basic",
        status: "started",
        conversation: mockConversation1,
        conversation_allowed: true,
        data: {}
      })
      .mockResolvedValueOnce({
        lesson_slug: "maze-solve-walk",
        status: "started",
        conversation: mockConversation2,
        conversation_allowed: true,
        data: {}
      });

    const { result, rerender } = renderHook(({ context }) => useConversationLoader(context), {
      initialProps: { context: { type: "lesson", slug: "maze-solve-basic" } as ExerciseContext }
    });

    // Wait for first load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation1);

    // Change to different exercise
    rerender({ context: { type: "lesson", slug: "maze-solve-walk" } as ExerciseContext });

    // Should load again
    await waitFor(() => {
      expect(result.current.conversation).toEqual(mockConversation2);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(2);
  });

  it("should retry with force reload", async () => {
    mockFetchUserLesson.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({
      lesson_slug: "maze-solve-basic",
      status: "started",
      conversation: [{ role: "user", content: "Retry successful" }],
      conversation_allowed: true,
      data: {}
    });

    const { result } = renderHook(() => useConversationLoader({ type: "lesson", slug: "maze-solve-basic" }));

    // Wait for initial error
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");

    // Retry
    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.conversation).toEqual([{ role: "user", content: "Retry successful" }]);
    expect(mockFetchUserLesson).toHaveBeenCalledTimes(2);
  });
});
