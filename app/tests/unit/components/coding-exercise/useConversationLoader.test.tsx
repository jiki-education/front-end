import { renderHook, waitFor, act } from "@testing-library/react";
import { useConversationLoader } from "@/components/coding-exercise/lib/useConversationLoader";
import { fetchUserLesson } from "@/lib/api/lessons";
import { fetchUserProject } from "@/lib/api/projects";
import { NotFoundError } from "@/lib/api/client";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";
import type { ExerciseContext } from "@/components/coding-exercise/lib/types";

jest.mock("@/lib/api/lessons");
jest.mock("@/lib/api/projects");
const mockFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;
const mockFetchUserProject = fetchUserProject as jest.MockedFunction<typeof fetchUserProject>;

const lessonContext: ExerciseContext = { type: "lesson", slug: "test-exercise" };
const projectContext: ExerciseContext = { type: "project", slug: "test-project" };

describe("useConversationLoader", () => {
  beforeEach(() => {
    mockFetchUserLesson.mockClear();
    mockFetchUserProject.mockClear();
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
      lesson_slug: "test-exercise",
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
    expect(mockFetchUserLesson).toHaveBeenCalledWith("test-exercise");
  });

  it("should load project conversations via fetchUserProject", async () => {
    const mockConversation: ChatMessage[] = [{ role: "user", content: "Project question" }];

    mockFetchUserProject.mockResolvedValue({
      project_slug: "test-project",
      status: "started",
      conversation: mockConversation,
      conversation_allowed: true
    });

    const { result } = renderHook(() => useConversationLoader(projectContext));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation);
    expect(mockFetchUserProject).toHaveBeenCalledWith("test-project");
    expect(mockFetchUserLesson).not.toHaveBeenCalled();
  });

  it("should treat NotFoundError as a fresh, empty, allowed conversation", async () => {
    mockFetchUserLesson.mockRejectedValue(new NotFoundError("Not Found"));

    const { result } = renderHook(() => useConversationLoader({ type: "lesson", slug: "new-exercise" }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual([]);
    expect(result.current.conversationAllowed).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fail closed when an existing record has conversation_allowed false", async () => {
    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "test-exercise",
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
      lesson_slug: "test-exercise",
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
    const { result } = renderHook(() => useConversationLoader({ type: "lesson", slug: "" }));

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
      lesson_slug: "cached-exercise",
      status: "started",
      conversation: mockConversation,
      conversation_allowed: true,
      data: {}
    });

    const cachedContext: ExerciseContext = { type: "lesson", slug: "cached-exercise" };
    const { result, rerender } = renderHook(({ context }) => useConversationLoader(context), {
      initialProps: { context: cachedContext }
    });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);

    // Rerender with an equivalent context (same type + slug)
    rerender({ context: { type: "lesson", slug: "cached-exercise" } });

    // Should not call API again
    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);
    expect(result.current.conversation).toEqual(mockConversation);
  });

  it("should keep lesson and project caches separate even with the same slug", async () => {
    const lessonConversation: ChatMessage[] = [{ role: "user", content: "Lesson message" }];
    const projectConversation: ChatMessage[] = [{ role: "user", content: "Project message" }];

    mockFetchUserLesson.mockResolvedValue({
      lesson_slug: "shared-slug",
      status: "started",
      conversation: lessonConversation,
      conversation_allowed: true,
      data: {}
    });
    mockFetchUserProject.mockResolvedValue({
      project_slug: "shared-slug",
      status: "started",
      conversation: projectConversation,
      conversation_allowed: true
    });

    const { result, rerender } = renderHook(({ context }) => useConversationLoader(context), {
      initialProps: { context: { type: "lesson", slug: "shared-slug" } as ExerciseContext }
    });

    await waitFor(() => {
      expect(result.current.conversation).toEqual(lessonConversation);
    });

    rerender({ context: { type: "project", slug: "shared-slug" } as ExerciseContext });

    await waitFor(() => {
      expect(result.current.conversation).toEqual(projectConversation);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);
    expect(mockFetchUserProject).toHaveBeenCalledTimes(1);
  });

  it("should reload when a different context slug is provided", async () => {
    const mockConversation1: ChatMessage[] = [{ role: "user", content: "Exercise 1 message" }];
    const mockConversation2: ChatMessage[] = [{ role: "user", content: "Exercise 2 message" }];

    mockFetchUserLesson
      .mockResolvedValueOnce({
        lesson_slug: "exercise-1",
        status: "started",
        conversation: mockConversation1,
        conversation_allowed: true,
        data: {}
      })
      .mockResolvedValueOnce({
        lesson_slug: "exercise-2",
        status: "started",
        conversation: mockConversation2,
        conversation_allowed: true,
        data: {}
      });

    const { result, rerender } = renderHook(({ context }) => useConversationLoader(context), {
      initialProps: { context: { type: "lesson", slug: "exercise-1" } as ExerciseContext }
    });

    // Wait for first load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation1);

    // Change to different exercise
    rerender({ context: { type: "lesson", slug: "exercise-2" } as ExerciseContext });

    // Should load again
    await waitFor(() => {
      expect(result.current.conversation).toEqual(mockConversation2);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(2);
  });

  it("should retry with force reload", async () => {
    mockFetchUserLesson.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({
      lesson_slug: "retry-exercise",
      status: "started",
      conversation: [{ role: "user", content: "Retry successful" }],
      conversation_allowed: true,
      data: {}
    });

    const { result } = renderHook(() => useConversationLoader({ type: "lesson", slug: "retry-exercise" }));

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
