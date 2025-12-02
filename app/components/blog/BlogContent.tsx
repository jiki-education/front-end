import Link from "next/link";
import type { ProcessedPost } from "@/lib/content/generated/types";

interface BlogContentProps {
  blogPosts: ProcessedPost[];
  authenticated: boolean;
  locale: string;
}

export default function BlogContent({ blogPosts, authenticated, locale }: BlogContentProps) {
  const getPostUrl = (slug: string) => {
    return locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  };

  return (
    <div className="space-y-12">
      {blogPosts.map((post) => (
        <article
          key={post.slug}
          className={
            authenticated
              ? "border-b border-border-primary pb-12 last:border-0"
              : "border-b border-gray-200 pb-12 last:border-0"
          }
        >
          <Link href={getPostUrl(post.slug)} className="group">
            <h2
              className={
                authenticated
                  ? "mb-3 text-3xl font-bold text-text-primary transition-colors group-hover:text-link-primary"
                  : "mb-3 text-3xl font-bold text-gray-900 transition-colors group-hover:text-blue-600"
              }
            >
              {post.title}
            </h2>
          </Link>
          <div
            className={
              authenticated
                ? "mb-4 flex items-center gap-3 text-sm text-text-secondary"
                : "mb-4 flex items-center gap-3 text-sm text-gray-600"
            }
          >
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </time>
            <span>•</span>
            <span>By {post.author.name}</span>
          </div>
          <p
            className={
              authenticated
                ? "mb-4 text-lg leading-relaxed text-text-primary"
                : "mb-4 text-lg leading-relaxed text-gray-700"
            }
          >
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={
                  authenticated
                    ? "rounded-full bg-info-bg px-3 py-1 text-sm text-info-text"
                    : "rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
