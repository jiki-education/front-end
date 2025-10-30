"use client";

import { useAuth } from "@/lib/auth/hooks";
import { fetchConcepts } from "@/lib/api/concepts";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { ConceptListItem } from "@/types/concepts";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/Pagination";

interface ConceptsState {
  concepts: ConceptListItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function ConceptsPage() {
  const { isAuthenticated, isReady } = useAuth();
  const [conceptsState, setConceptsState] = useState<ConceptsState>({
    concepts: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query by 500ms
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const loadConcepts = async (page: number = 1, title?: string) => {
    if (!isReady) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use unscoped=true for logged out users to show all concepts
      const unscoped = !isAuthenticated;
      const response = await fetchConcepts({
        unscoped,
        page,
        title: title || undefined
      });

      setConceptsState({
        concepts: response.results,
        currentPage: response.meta.current_page,
        totalPages: response.meta.total_pages,
        totalCount: response.meta.total_count
      });
    } catch (err) {
      setError("Failed to load concepts. Please try again later.");
      console.error("Error fetching concepts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load concepts when auth is ready or search query changes
  useEffect(() => {
    if (isReady) {
      void loadConcepts(1, debouncedSearchQuery);
    }
    // loadConcepts is recreated on every render, excluding from deps to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isReady, debouncedSearchQuery]);

  const handlePageChange = (page: number) => {
    void loadConcepts(page, debouncedSearchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (!isReady || (isLoading && conceptsState.concepts.length === 0)) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="mb-4 h-12 w-64 bg-gray-200 rounded"></div>
            <div className="h-6 w-96 bg-gray-200 rounded"></div>
            <div className="mt-6 h-10 w-80 bg-gray-200 rounded"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="mb-4 space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && conceptsState.concepts.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <div className="mb-4 text-red-600 text-lg">{error}</div>
          <button
            onClick={() => void loadConcepts(1, debouncedSearchQuery)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Concepts</h1>
        <p className="text-lg text-gray-600">Core programming concepts to master your coding skills</p>
        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Sign up to track your progress and unlock personalized content!</p>
          </div>
        )}
      </header>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-5 h-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {debouncedSearchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {conceptsState.totalCount} result{conceptsState.totalCount !== 1 ? "s" : ""} for &quot;
                {debouncedSearchQuery}&quot;
              </span>
            )}
          </div>
        )}

        {/* Total Count */}
        {!debouncedSearchQuery && !isLoading && (
          <div className="mt-2 text-sm text-gray-600">
            {conceptsState.totalCount} concept{conceptsState.totalCount !== 1 ? "s" : ""} available
          </div>
        )}
      </div>

      {/* Loading State for Search/Pagination */}
      {isLoading && conceptsState.concepts.length > 0 && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </div>
        </div>
      )}

      {/* Results */}
      {conceptsState.concepts.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 text-lg">
            {debouncedSearchQuery
              ? `No concepts found for "${debouncedSearchQuery}"`
              : "No concepts available at the moment."}
          </p>
          {debouncedSearchQuery && (
            <button onClick={clearSearch} className="mt-4 text-blue-600 hover:text-blue-800 underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {conceptsState.concepts.map((concept) => (
              <article
                key={concept.slug}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <Link href={`/concepts/${concept.slug}`}>
                  <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {concept.title}
                  </h2>
                </Link>
                <p className="mb-4 line-clamp-3 text-gray-700">{concept.description}</p>

                {(concept.standard_video_provider || concept.premium_video_provider) && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Video available</span>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={conceptsState.currentPage}
            totalPages={conceptsState.totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        </>
      )}
    </div>
  );
}
