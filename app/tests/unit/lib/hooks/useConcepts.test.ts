import { renderHook, act } from "@testing-library/react";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { fetchConcepts } from "@/lib/api/concepts";

jest.mock("@/lib/api/concepts");
const mockFetchConcepts = fetchConcepts as jest.MockedFunction<typeof fetchConcepts>;

describe("useConcepts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useConcepts({ isAuthenticated: false, isReady: false }));

    expect(result.current.conceptsState).toEqual({
      concepts: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("does not call loadConcepts when not ready", async () => {
    const { result } = renderHook(() => useConcepts({ isAuthenticated: false, isReady: false }));

    await act(async () => {
      await result.current.loadConcepts(1);
    });

    expect(mockFetchConcepts).not.toHaveBeenCalled();
  });

  it("calls fetchConcepts when ready", async () => {
    const mockResponse = {
      results: [],
      meta: {
        current_page: 1,
        total_pages: 1,
        total_count: 0
      }
    };
    mockFetchConcepts.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useConcepts({ isAuthenticated: false, isReady: true }));

    await act(async () => {
      await result.current.loadConcepts(1);
    });

    expect(mockFetchConcepts).toHaveBeenCalledWith({
      scope: "external",
      page: 1,
      title: undefined
    });
  });

  it("updates state correctly on successful fetch", async () => {
    const mockResponse = {
      results: [
        {
          slug: "test",
          title: "Test",
          description: "Test concept",
          children_count: 0,
          standard_video_provider: null,
          standard_video_id: null,
          premium_video_provider: null,
          premium_video_id: null
        }
      ],
      meta: {
        current_page: 1,
        total_pages: 2,
        total_count: 10
      }
    };
    mockFetchConcepts.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useConcepts({ isAuthenticated: false, isReady: true }));

    await act(async () => {
      await result.current.loadConcepts(1);
    });

    expect(result.current.conceptsState).toEqual({
      concepts: mockResponse.results,
      currentPage: 1,
      totalPages: 2,
      totalCount: 10
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("handles errors correctly", async () => {
    mockFetchConcepts.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useConcepts({ isAuthenticated: false, isReady: true }));

    await act(async () => {
      await result.current.loadConcepts(1);
    });

    expect(result.current.error).toBe("Failed to load concepts. Please try again later.");
    expect(result.current.isLoading).toBe(false);
  });
});
