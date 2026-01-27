import { renderHook, waitFor, act } from "@testing-library/react";
import { useConversationLoader } from "@/components/coding-exercise/lib/useConversationLoader";
import { fetchUserLesson } from "@/lib/api/lessons";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

// Mock the API
jest.mock("@/lib/api/lessons");
const mockFetchUserLesson = fetchUserLesson as jest.MockedFunction<typeof fetchUserLesson>;

describe("useConversationLoader", () => {
  beforeEach(() => {
    mockFetchUserLesson.mockClear();
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

    const { result } = renderHook(() => useConversationLoader("test-exercise"));

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.conversation).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the load to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation);
    expect(result.current.error).toBeNull();
    expect(mockFetchUserLesson).toHaveBeenCalledWith("test-exercise");
  });

  it("should handle user lesson not found gracefully", async () => {
    mockFetchUserLesson.mockRejectedValue(new Error("User lesson not found"));

    const { result } = renderHook(() => useConversationLoader("new-exercise"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors", async () => {
    mockFetchUserLesson.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useConversationLoader("test-exercise"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual([]);
    expect(result.current.error).toBe("Network error");
  });

  it("should handle empty exercise slug", async () => {
    const { result } = renderHook(() => useConversationLoader(""));

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

    const { result, rerender } = renderHook(({ slug }) => useConversationLoader(slug), {
      initialProps: { slug: "cached-exercise" }
    });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);

    // Rerender with same slug
    rerender({ slug: "cached-exercise" });

    // Should not call API again
    expect(mockFetchUserLesson).toHaveBeenCalledTimes(1);
    expect(result.current.conversation).toEqual(mockConversation);
  });

  it("should reload when different exercise slug is provided", async () => {
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

    const { result, rerender } = renderHook(({ slug }) => useConversationLoader(slug), {
      initialProps: { slug: "exercise-1" }
    });

    // Wait for first load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversation).toEqual(mockConversation1);

    // Change to different exercise
    rerender({ slug: "exercise-2" });

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

    const { result } = renderHook(() => useConversationLoader("retry-exercise"));

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
