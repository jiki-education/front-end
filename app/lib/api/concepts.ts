import { api } from "./client";
import type { ConceptListItem, ConceptDetail } from "@/types/concepts";

type ApiScope = "internal" | "external";

interface FetchConceptsOptions {
  scope: ApiScope;
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
export async function fetchConcepts(options: FetchConceptsOptions): Promise<ConceptsResponse> {
  const { scope, title, page } = options;

  const params: Record<string, string | number | boolean> = {};

  if (title && title.trim()) {
    params.title = title.trim();
  }

  if (page && page > 1) {
    params.page = page;
  }

  const endpoint = `/${scope}/concepts`;
  const response = await api.get<ConceptsResponse>(endpoint, { params });
  return response.data;
}

/**
 * Fetch single concept by slug
 * @param slug - The concept slug
 * @param scope - API scope: "internal" for authenticated, "external" for unauthenticated
 */
export async function fetchConcept(slug: string, scope: ApiScope): Promise<ConceptDetail> {
  const endpoint = `/${scope}/concepts/${slug}`;
  const response = await api.get<{ concept: ConceptDetail }>(endpoint);
  return response.data.concept;
}

/**
 * Fetch multiple concepts by their slugs
 * @param slugs - Array of concept slugs to fetch
 * @param scope - API scope: "internal" for authenticated, "external" for unauthenticated
 * @returns Array of concept items
 */
export async function fetchConceptsBySlugs(slugs: string[], scope: ApiScope): Promise<ConceptListItem[]> {
  if (slugs.length === 0) {
    return [];
  }

  const endpoint = `/${scope}/concepts`;
  const response = await api.get<{ results: ConceptListItem[] }>(endpoint, {
    params: { slugs: slugs.join(",") }
  });
  return response.data.results;
}

/**
 * Fetch subconcepts for a parent concept
 * @param parentSlug - The parent concept's slug
 * @param scope - API scope: "internal" for authenticated, "external" for unauthenticated
 * @returns Array of subconcept items
 */
export async function fetchSubconcepts(parentSlug: string, scope: ApiScope): Promise<ConceptListItem[]> {
  const endpoint = `/${scope}/concepts`;
  const response = await api.get<{ results: ConceptListItem[] }>(endpoint, {
    params: { parent_slug: parentSlug }
  });
  return response.data.results;
}
