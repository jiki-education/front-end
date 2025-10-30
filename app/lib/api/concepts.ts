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

  if (unscoped) {
    params.unscoped = true;
  }

  if (title && title.trim()) {
    params.title = title.trim();
  }

  if (page && page > 1) {
    params.page = page;
  }

  const response = await api.get<ConceptsResponse>("/v1/concepts", { params });
  return response.data;
}

/**
 * Fetch single concept by slug
 * @param slug - The concept slug
 * @param unscoped - If true, returns concept regardless of user authentication/unlock status
 */
export async function fetchConcept(slug: string, unscoped?: boolean): Promise<ConceptDetail> {
  const params = unscoped ? { unscoped: true } : undefined;
  const response = await api.get<{ concept: ConceptDetail }>(`/v1/concepts/${slug}`, { params });
  return response.data.concept;
}
