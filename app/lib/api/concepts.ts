import { api } from "./client";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptListItem, ConceptDetail } from "@/types/concepts";

/**
 * Get the API scope based on authentication state.
 * Client-side: uses auth store
 * Server-side: defaults to "external" (for public metadata)
 */
function getApiScope(): "internal" | "external" {
  const isClient = typeof window !== "undefined";
  const isAuthenticated = isClient ? useAuthStore.getState().isAuthenticated : false;
  return isAuthenticated ? "internal" : "external";
}

interface FetchConceptsOptions {
  title?: string;
  page?: number;
}

interface ConceptsResponse {
  results: ConceptListItem[];
  meta: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

/**
 * Fetch list of concepts
 * @param options - Search and pagination options
 */
export async function fetchConcepts(options: FetchConceptsOptions = {}): Promise<ConceptsResponse> {
  const { title, page } = options;

  const params: Record<string, string | number | boolean> = {};

  if (title && title.trim()) {
    params.title = title.trim();
  }

  if (page && page > 1) {
    params.page = page;
  }

  const endpoint = `/${getApiScope()}/concepts`;
  const response = await api.get<ConceptsResponse>(endpoint, { params });
  return response.data;
}

/**
 * Fetch single concept by slug
 * @param slug - The concept slug
 */
export async function fetchConcept(slug: string): Promise<ConceptDetail> {
  const endpoint = `/${getApiScope()}/concepts/${slug}`;
  const response = await api.get<{ concept: ConceptDetail }>(endpoint);
  return response.data.concept;
}

/**
 * Fetch multiple concepts by their slugs
 * @param slugs - Array of concept slugs to fetch
 * @returns Array of concept items
 */
export async function fetchConceptsBySlugs(slugs: string[]): Promise<ConceptListItem[]> {
  if (slugs.length === 0) {
    return [];
  }

  const endpoint = `/${getApiScope()}/concepts`;
  const response = await api.get<{ results: ConceptListItem[] }>(endpoint, {
    params: { slugs: slugs.join(",") }
  });
  return response.data.results;
}

/**
 * Fetch subconcepts for a parent concept
 * @param parentSlug - The parent concept's slug
 * @returns Array of subconcept items
 */
export async function fetchSubconcepts(parentSlug: string): Promise<ConceptListItem[]> {
  const endpoint = `/${getApiScope()}/concepts`;
  const response = await api.get<{ results: ConceptListItem[] }>(endpoint, {
    params: { parent_slug: parentSlug }
  });
  return response.data.results;
}
