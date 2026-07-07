"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchIcon from "@/icons/search.svg";
import CrossIcon from "@/icons/cross.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import { getGuideTagLabel, type GuideMeta, type GuideTagSlug } from "@/lib/content/types";
import { useGuidesSearch } from "@/lib/hooks/useGuidesSearch";
import Pagination from "@/components/ui/Pagination";
import GuideCard from "./GuideCard";
import styles from "./GuidesContent.module.css";

const GUIDES_PAGE_SIZE = 12;

interface GuidesContentProps {
  /** All guides for the locale, already tag-filtered. Includes premium guides. */
  guides: GuideMeta[];
  locale: string;
  selectedTag: GuideTagSlug | null;
  tagSlugs: readonly GuideTagSlug[];
}

export default function GuidesContent({ guides, locale, selectedTag, tagSlugs }: GuidesContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery, searchResults } = useGuidesSearch(locale);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  // Premium guides are only shown once the viewer is authenticated: logged-out
  // (and the pre-hydration server render) never see them at all. Authenticated
  // non-premium viewers see a locked card; premium viewers see a normal card.
  const visibleGuides = guides.filter((guide) => !guide.premium || isAuthenticated);

  // Apply full-text search (by slug) when a query is active.
  const searchedGuides =
    searchResults === null ? visibleGuides : visibleGuides.filter((guide) => searchResults.includes(guide.slug));

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
  const totalPages = Math.ceil(searchedGuides.length / GUIDES_PAGE_SIZE);

  // Hide pagination while searching (results are typically small).
  const showPagination = searchResults === null && totalPages > 1;
  const start = (currentPage - 1) * GUIDES_PAGE_SIZE;
  const pagedGuides = showPagination ? searchedGuides.slice(start, start + GUIDES_PAGE_SIZE) : searchedGuides;

  const hrefForPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const buildTagUrl = (tag: GuideTagSlug | null) => (tag === null ? pathname : `${pathname}?tag=${tag}`);

  const showNoResults = searchQuery && searchResults !== null && pagedGuides.length === 0;

  return (
    <div className={styles.contentLayout}>
      <div className={styles.contentMain}>
        <div className={`ui-search-input ${styles.searchBar} ${searchQuery ? styles.hasValue : ""}`}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSearchQuery("")} type="button" className={styles.searchClearBtn}>
            <CrossIcon />
          </button>
        </div>

        {showNoResults ? (
          <div className={styles.noResults}>
            <p className={styles.noResultsTitle}>0 results for &ldquo;{searchQuery}&rdquo;</p>
            <p className={styles.noResultsMessage}>Try a different search term or browse the guides.</p>
          </div>
        ) : (
          <div className={styles.guidesGrid}>
            {pagedGuides.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                locale={locale}
                premiumLocked={guide.premium && !userIsPremium}
              />
            ))}
          </div>
        )}

        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hrefForPage={hrefForPage}
            className={styles.pagination}
          />
        )}
      </div>

      <div className={styles.filterSidebar}>
        <div className={styles.filterTags}>
          <span className={styles.filterTagsLabel}>Filter by</span>
          <Link href={buildTagUrl(null)} className={`${styles.filterTag} ${selectedTag === null ? styles.active : ""}`}>
            All
          </Link>
          {tagSlugs.map((slug) => (
            <Link
              key={slug}
              href={buildTagUrl(slug)}
              className={`${styles.filterTag} ${selectedTag === slug ? styles.active : ""}`}
            >
              {getGuideTagLabel(slug, locale)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
