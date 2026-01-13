import { api } from "./client";
import type { ConceptListItem, ConceptDetail } from "@/types/concepts";

interface FetchConceptsOptions {
  unscoped?: boolean;
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
  const { unscoped, title, page } = options;

  const params: Record<string, string | number | boolean> = {};

  if (title && title.trim()) {
    params.title = title.trim();
  }

  if (page && page > 1) {
    params.page = page;
  }

  // Use external endpoint for unscoped (unauthenticated) requests, internal for authenticated
  const endpoint = unscoped ? "/external/concepts" : "/internal/concepts";
  const response = await api.get<ConceptsResponse>(endpoint, { params });
  return response.data;
}

/**
 * Fetch single concept by slug
 * @param slug - The concept slug
 * @param unscoped - If true, returns concept regardless of user authentication/unlock status
 */
export async function fetchConcept(slug: string, unscoped?: boolean): Promise<ConceptDetail> {
  // Use external endpoint for unscoped (unauthenticated) requests, internal for authenticated
  const endpoint = unscoped ? `/external/concepts/${slug}` : `/internal/concepts/${slug}`;
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

  const response = await api.get<{ results: ConceptListItem[] }>("/internal/concepts", {
    params: { slugs: slugs.join(",") }
  });
  return response.data.results;
}
