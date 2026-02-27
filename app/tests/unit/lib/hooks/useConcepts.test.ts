import { renderHook, act, waitFor } from "@testing-library/react";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { getTopLevelConcepts, searchConcepts } from "@/lib/api/concepts";
import { fetchUnlockedConceptSlugs } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";

jest.mock("@/lib/api/concepts");
jest.mock("@/lib/api/concept-unlocks");
jest.mock("@/lib/auth/authStore");

const mockGetTopLevelConcepts = getTopLevelConcepts as jest.MockedFunction<typeof getTopLevelConcepts>;
const mockSearchConcepts = searchConcepts as jest.MockedFunction<typeof searchConcepts>;
const mockFetchUnlockedSlugs = fetchUnlockedConceptSlugs as jest.MockedFunction<typeof fetchUnlockedConceptSlugs>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const mockConcepts = [
  {
    slug: "variables",
    title: "Variables",
    description: "Store values",
    parentSlug: null,
    order: 1,
    category: true,
    childrenCount: 2,
    exerciseSlugs: ["sprouting-flower"],
    contentHash: null
  },
  {
    slug: "functions",
    title: "Functions",
    description: "Reusable code",
    parentSlug: null,
    order: 2,
    category: false,
    childrenCount: 0,
    exerciseSlugs: [],
    contentHash: "abc123"
  }
];

describe("useConcepts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue(false);
    mockGetTopLevelConcepts.mockResolvedValue(mockConcepts);
    mockFetchUnlockedSlugs.mockResolvedValue([]);
  });

  it("initializes with loading state", () => {
    const { result } = renderHook(() => useConcepts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("loads top-level concepts on mount", async () => {
    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetTopLevelConcepts).toHaveBeenCalled();
    expect(result.current.concepts).toHaveLength(2);
    expect(result.current.concepts[0].slug).toBe("variables");
    expect(result.current.totalCount).toBe(2);
  });

  it("marks all concepts as unlocked when not authenticated", async () => {
    mockUseAuthStore.mockReturnValue(false);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.concepts.every((c) => c.isUnlocked)).toBe(true);
  });

  it("fetches unlock state when authenticated", async () => {
    mockUseAuthStore.mockReturnValue(true);
    mockFetchUnlockedSlugs.mockResolvedValue(["variables"]);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUnlockedSlugs).toHaveBeenCalled();
    const variables = result.current.concepts.find((c) => c.slug === "variables");
    const functions = result.current.concepts.find((c) => c.slug === "functions");
    expect(variables?.isUnlocked).toBe(true);
    expect(functions?.isUnlocked).toBe(false);
    expect(result.current.unlockedCount).toBe(1);
  });

  it("scopes search to top-level concepts", async () => {
    mockSearchConcepts.mockResolvedValue([mockConcepts[0]]);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch("variables");
    });

    expect(result.current.searchQuery).toBe("variables");
    expect(mockSearchConcepts).toHaveBeenCalledWith("variables", null);
  });

  it("resets to all concepts when search is cleared", async () => {
    mockSearchConcepts.mockResolvedValue([mockConcepts[0]]);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch("variables");
    });

    await act(async () => {
      await result.current.handleSearch("");
    });

    expect(result.current.concepts).toHaveLength(2);
  });

  it("handles errors correctly", async () => {
    mockGetTopLevelConcepts.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load concepts. Please try again later.");
  });
});
