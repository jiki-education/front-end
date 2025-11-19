import Image from "next/image";
import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedPost } from "@jiki/content";

interface BlogPostContentProps {
  post: ProcessedPost;
  variant?: "authenticated" | "unauthenticated";
}

export default function BlogPostContent({ post, variant = "unauthenticated" }: BlogPostContentProps) {
  const isAuthenticated = variant === "authenticated";

  return (
    <article>
      <header className="mb-12">
        <h1
          className={
            isAuthenticated ? "mb-6 text-5xl font-bold text-text-primary" : "mb-6 text-5xl font-bold text-gray-900"
          }
        >
          {post.title}
        </h1>
        <div
          className={
            isAuthenticated
              ? "mb-6 flex items-center gap-4 text-text-secondary"
              : "mb-6 flex items-center gap-4 text-gray-600"
          }
        >
          <time dateTime={post.date} className="text-sm">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </time>
          <span className="text-sm">•</span>
          <span className="text-sm">By {post.author.name}</span>
        </div>
        {post.coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={
                isAuthenticated
                  ? "rounded-full bg-info-bg px-3 py-1 text-sm text-info-text"
                  : "rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <MarkdownContent content={post.content} />
    </article>
  );
}
