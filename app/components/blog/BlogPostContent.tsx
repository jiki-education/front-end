import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedPost } from "@jiki/content";

interface BlogPostContentProps {
  post: ProcessedPost;
  variant?: "authenticated" | "unauthenticated";
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <>
      {/* Purple Gradient Header */}
      <header
        className="py-80 mb-0"
        style={{
          background: "linear-gradient(135deg, #581c87 0%, #3b0764 100%)",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(135deg, #581c87 0%, #3b0764 100%)",
          backgroundSize: "20px 20px, 20px 20px, cover",
          backgroundPosition: "0 0, 0 0, center"
        }}
      >
        <div className="max-w-[950px] mx-auto px-80">
          {/* Meta Row */}
          <div className="flex items-center gap-12 mb-24">
            <span className="text-base text-purple-300 font-medium">
              {new Date(post.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
            {post.tags[0] && (
              <span className="inline-block bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-16 py-8 rounded-8 text-15 font-semibold tracking-wide">
                {post.tags[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-56 font-extrabold text-white mb-16 leading-[1.2]">{post.title}</h1>

          {/* Subtitle */}
          {post.excerpt && <p className="text-22 text-purple-200 mb-20 leading-[1.6]">{post.excerpt}</p>}

          {/* Author Meta */}
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-sm">
                {post.author.name.charAt(0)}
              </div>
              <span className="text-purple-200 text-base font-medium">by {post.author.name}</span>
            </div>
            <div className="flex items-center gap-6 text-purple-200 text-base font-medium">
              <span>⏱️</span>
              <span>{Math.ceil(post.content.split(" ").length / 200)} minute read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <MarkdownContent content={post.content} />
    </>
  );
}
