import Image from "next/image";
import Link from "next/link";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";

interface RelatedArticlesProps {
  articles: ProcessedBlogPost[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="max-w-[1400px] mx-auto mb-80 px-80">
      <h2 className="text-36 font-bold text-[#1a202c] mb-32 pt-72 text-left">Related Articles</h2>
      <div className="grid grid-cols-3 gap-32">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group relative bg-white border-none rounded-16 p-32 transition-all cursor-pointer flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-4 hover:shadow-[0_12px_32px_rgba(102,126,234,0.2)] before:content-[''] before:absolute before:inset-0 before:rounded-16 before:p-2 before:bg-gradient-to-br before:from-[#667eea] before:to-[#764ba2] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:opacity-30 before:transition-opacity hover:before:opacity-100"
          >
            {article.coverImage && (
              <Image
                src={article.coverImage}
                alt={article.title}
                width={400}
                height={240}
                className="w-full h-60 object-cover rounded-12 mb-20"
              />
            )}
            <div className="flex items-center gap-12 mb-16">
              <span className="text-sm text-gray-500 font-medium">
                {new Date(article.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
              {article.tags[0] && (
                <span className="inline-block bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)] text-[#667eea] px-10 py-4 rounded-6 text-xs font-semibold uppercase tracking-wider">
                  {article.tags[0]}
                </span>
              )}
            </div>
            <h3 className="text-24 font-bold text-[#1a202c] mb-12 leading-snug">{article.title}</h3>
            <p className="text-base text-[#4a5568] leading-relaxed mb-0 line-clamp-3">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
