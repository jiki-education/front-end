import type { GuideMeta } from "./types";
import { getAllGuides } from "./getAllGuides";
import { type GuideTagSlug } from "./types";

const GUIDES_PAGE_SIZE = 10;

export interface GetGuidesOptions {
  locale?: string;
  tag?: GuideTagSlug | null;
  page?: number;
  /**
   * Whether to include premium guides in the result. Defaults to false, so
   * unauthenticated/public callers never receive premium guides. The client
   * list opts in (based on the viewer's membership) to render locked cards.
   */
  includePremium?: boolean;
}

export interface GetGuidesResult {
  guides: GuideMeta[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Get guides with optional tag filtering and pagination
 * Sorted alphabetically by title. Premium guides are excluded unless
 * `includePremium` is set.
 */
export function getGuides(options: GetGuidesOptions = {}): GetGuidesResult {
  const { locale = "en", tag = null, page = 1, includePremium = false } = options;

  const allGuides = getAllGuides(locale);
  let filteredGuides = includePremium ? allGuides : allGuides.filter((guide) => !guide.premium);

  // Filter by tag if provided
  if (tag) {
    filteredGuides = filteredGuides.filter((guide) => guide.tags.includes(tag));
  }

  const totalCount = filteredGuides.length;
  const totalPages = Math.ceil(totalCount / GUIDES_PAGE_SIZE);

  // Paginate
  const start = (page - 1) * GUIDES_PAGE_SIZE;
  const paginatedGuides = filteredGuides.slice(start, start + GUIDES_PAGE_SIZE);

  return {
    guides: paginatedGuides,
    totalCount,
    totalPages,
    currentPage: page
  };
}
