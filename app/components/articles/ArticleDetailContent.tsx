import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedPost } from "@jiki/content";

interface ArticleDetailContentProps {
  article: ProcessedPost;
  variant?: "authenticated" | "unauthenticated";
}

export default function ArticleDetailContent({ article }: ArticleDetailContentProps) {
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
            {article.tags[0] && (
              <span className="inline-block bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-16 py-8 rounded-8 text-15 font-semibold tracking-wide">
                {article.tags[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-56 font-extrabold text-white mb-16 leading-[1.2]">{article.title}</h1>

          {/* Subtitle */}
          {article.excerpt && <p className="text-22 text-purple-200 mb-20 leading-[1.6]">{article.excerpt}</p>}

          {/* Reading time */}
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-6 text-purple-200 text-base font-medium">
              <span>⏱️</span>
              <span>{Math.ceil(article.content.split(" ").length / 200)} minute read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <MarkdownContent content={article.content} />
    </>
  );
}
