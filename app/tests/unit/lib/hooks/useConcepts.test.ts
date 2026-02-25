import { renderHook, act, waitFor } from "@testing-library/react";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { getConcepts, searchConcepts } from "@/lib/concepts/actions";
import { fetchUnlockedConceptSlugs } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";

jest.mock("@/lib/concepts/actions");
jest.mock("@/lib/api/concept-unlocks");
jest.mock("@/lib/auth/authStore");

const mockGetConcepts = getConcepts as jest.MockedFunction<typeof getConcepts>;
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
    childrenCount: 2,
    exerciseSlugs: ["sprouting-flower"]
  },
  {
    slug: "strings",
    title: "Strings",
    description: "Text data",
    parentSlug: "variables",
    order: 1,
    childrenCount: 0,
    exerciseSlugs: []
  }
];

describe("useConcepts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue(false);
    mockGetConcepts.mockResolvedValue(mockConcepts);
    mockFetchUnlockedSlugs.mockResolvedValue([]);
  });

  it("initializes with loading state", () => {
    const { result } = renderHook(() => useConcepts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("loads concepts on mount", async () => {
    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

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
    const strings = result.current.concepts.find((c) => c.slug === "strings");
    expect(variables?.isUnlocked).toBe(true);
    expect(strings?.isUnlocked).toBe(false);
    expect(result.current.unlockedCount).toBe(1);
  });

  it("handles search via handleSearch", async () => {
    mockSearchConcepts.mockResolvedValue([mockConcepts[0]]);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSearch("variables");
    });

    expect(result.current.searchQuery).toBe("variables");
    expect(mockSearchConcepts).toHaveBeenCalledWith("variables");
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
    mockGetConcepts.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load concepts. Please try again later.");
  });
});
