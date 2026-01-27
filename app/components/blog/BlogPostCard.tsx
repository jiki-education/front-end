import Link from "next/link";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";

interface BlogPostCardProps {
  post: ProcessedBlogPost;
  locale: string;
}

export default function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const postUrl = locale === "en" ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;

  return (
    <article className="border-b border-border-primary pb-12 last:border-0">
      <Link href={postUrl} className="group">
        <h2 className="mb-3 text-3xl font-bold text-text-primary transition-colors group-hover:text-link-primary">
          {post.title}
        </h2>
      </Link>
      <div className="mb-4 flex items-center gap-3 text-sm text-text-secondary">
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
      <p className="mb-4 text-lg leading-relaxed text-text-primary">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-info-bg px-3 py-1 text-sm text-info-text">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
