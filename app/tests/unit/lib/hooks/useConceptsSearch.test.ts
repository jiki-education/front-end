import { renderHook, act } from "@testing-library/react";
import { useConceptsSearch } from "@/lib/hooks/useConceptsSearch";

jest.mock("@/lib/hooks/useDebounce", () => ({
  useDebounce: jest.fn((value: string) => value)
}));

describe("useConceptsSearch", () => {
  const mockLoadConcepts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with empty search query", () => {
    const { result } = renderHook(() => useConceptsSearch(mockLoadConcepts, false));

    expect(result.current.searchQuery).toBe("");
    expect(result.current.debouncedSearchQuery).toBe("");
  });

  it("does not call loadConcepts when not ready", () => {
    renderHook(() => useConceptsSearch(mockLoadConcepts, false));
    expect(mockLoadConcepts).not.toHaveBeenCalled();
  });

  it("calls loadConcepts when ready", () => {
    renderHook(() => useConceptsSearch(mockLoadConcepts, true));
    expect(mockLoadConcepts).toHaveBeenCalledWith(1, "");
  });

  it("updates search query when handleSearchChange is called", () => {
    const { result } = renderHook(() => useConceptsSearch(mockLoadConcepts, false));

    act(() => {
      result.current.handleSearchChange({ target: { value: "test" } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchQuery).toBe("test");
  });

  it("clears search query when clearSearch is called", () => {
    const { result } = renderHook(() => useConceptsSearch(mockLoadConcepts, false));

    act(() => {
      result.current.handleSearchChange({ target: { value: "test" } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchQuery).toBe("test");

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe("");
  });

  it("provides all expected return values", () => {
    const { result } = renderHook(() => useConceptsSearch(mockLoadConcepts, false));

    expect(typeof result.current.searchQuery).toBe("string");
    expect(typeof result.current.debouncedSearchQuery).toBe("string");
    expect(typeof result.current.handleSearchChange).toBe("function");
    expect(typeof result.current.clearSearch).toBe("function");
  });
});
