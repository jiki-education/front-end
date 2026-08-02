"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ArticleTagSlug, getArticleTagLabel } from "@/lib/content/types";
import { FORUM_URL } from "@/lib/constants/social";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  tagSlugs: readonly ArticleTagSlug[];
  selectedTag: ArticleTagSlug | null;
  locale: string;
}

export default function FilterSidebar({ tagSlugs, selectedTag, locale }: FilterSidebarProps) {
  const t = useTranslations("articles.filterSidebar");
  const pathname = usePathname();
  const routes = useLocaleRoutes();

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
            {getArticleTagLabel(slug, locale)}
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
              <a href={FORUM_URL} target="_blank" rel="noopener noreferrer">
                {chunks}
              </a>
            )
          })}
        </p>
      </div>
    </div>
  );
}
