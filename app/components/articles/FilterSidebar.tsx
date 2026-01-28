"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ArticleTagSlug, getArticleTagLabel } from "@/lib/content";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  tagSlugs: readonly ArticleTagSlug[];
  selectedTag: ArticleTagSlug | null;
  locale: string;
}

export default function FilterSidebar({ tagSlugs, selectedTag, locale }: FilterSidebarProps) {
  const pathname = usePathname();

  const buildTagUrl = (tag: ArticleTagSlug | null) => {
    if (tag === null) {
      return pathname;
    }
    return `${pathname}?tag=${tag}`;
  };

  return (
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
            {getArticleTagLabel(slug, locale)}
          </Link>
        ))}
      </div>
      <div className={styles.filterHelp}>
        <p className={styles.filterHelpText}>
          Can&apos;t find what you&apos;re looking for? Try our <a href="#">Blogs</a>, <a href="#">FAQs</a>,{" "}
          <a href="#">Contact support</a>, or ask in our <a href="#">Community</a>
        </p>
      </div>
    </div>
  );
}
