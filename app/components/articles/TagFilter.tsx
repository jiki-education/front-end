"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ArticleTagSlug, getArticleTagLabel } from "@/lib/content";

interface TagFilterProps {
  tagSlugs: readonly ArticleTagSlug[];
  selectedTag: ArticleTagSlug | null;
  locale: string;
}

export default function TagFilter({ tagSlugs, selectedTag, locale }: TagFilterProps) {
  const pathname = usePathname();

  const buildTagUrl = (tag: ArticleTagSlug | null) => {
    if (tag === null) {
      return pathname;
    }
    return `${pathname}?tag=${tag}`;
  };

  const baseButtonClass = "rounded-full px-4 py-2 text-sm font-medium transition-colors";

  const getButtonClass = (isActive: boolean) => {
    return isActive
      ? `${baseButtonClass} bg-primary-bg text-primary-text`
      : `${baseButtonClass} bg-bg-secondary text-text-secondary hover:bg-bg-tertiary`;
  };

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link href={buildTagUrl(null)} className={getButtonClass(selectedTag === null)}>
        All
      </Link>
      {tagSlugs.map((slug) => (
        <Link key={slug} href={buildTagUrl(slug)} className={getButtonClass(selectedTag === slug)}>
          {getArticleTagLabel(slug, locale)}
        </Link>
      ))}
    </div>
  );
}
