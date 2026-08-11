"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ArticleTagSlug } from "@/lib/content/types";
import { useForumUrl } from "@/lib/i18n/externalLinks";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  tagSlugs: readonly ArticleTagSlug[];
  selectedTag: ArticleTagSlug | null;
}

export default function FilterSidebar({ tagSlugs, selectedTag }: FilterSidebarProps) {
  const t = useTranslations("articles.filterSidebar");
  const tTags = useTranslations("articles.tags");
  const pathname = usePathname();
  const routes = useLocaleRoutes();
  const forumUrl = useForumUrl();

  const buildTagUrl = (tag: ArticleTagSlug | null) => {
    if (tag === null) {
      return pathname;
    }
    return `${pathname}?tag=${tag}`;
  };

  return (
    <div className={styles.filterSidebar}>
      <div className={styles.filterTags}>
        <span className={styles.filterTagsLabel}>{t("filterBy")}</span>
        <Link href={buildTagUrl(null)} className={`${styles.filterTag} ${selectedTag === null ? styles.active : ""}`}>
          {t("all")}
        </Link>
        {tagSlugs.map((slug) => (
          <Link
            key={slug}
            href={buildTagUrl(slug)}
            className={`${styles.filterTag} ${selectedTag === slug ? styles.active : ""}`}
          >
            {tTags(slug)}
          </Link>
        ))}
      </div>
      <div className={styles.filterHelp}>
        <p className={styles.filterHelpText}>
          {t.rich("help", {
            blogs: (chunks) => <Link href={routes.blog()}>{chunks}</Link>,
            faqs: (chunks) => <Link href={routes.article("faqs")}>{chunks}</Link>,
            support: (chunks) => <Link href={routes.article("support")}>{chunks}</Link>,
            community: (chunks) => (
              <a href={forumUrl} target="_blank" rel="noopener noreferrer">
                {chunks}
              </a>
            )
          })}
        </p>
      </div>
    </div>
  );
}
