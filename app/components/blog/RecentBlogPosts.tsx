import Image from "next/image";
import Link from "next/link";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";

interface RecentBlogPostsProps {
  posts: ProcessedBlogPost[];
}

export default function RecentBlogPosts({ posts }: RecentBlogPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto mb-40 md:mb-80 px-20 md:px-80">
      <h2 className="text-24 md:text-36 font-bold text-[#1a202c] mb-20 md:mb-32 pt-40 md:pt-72 text-left">
        Recent Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-32">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group relative bg-white border-none rounded-16 p-20 md:p-32 transition-all cursor-pointer flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-4 hover:shadow-[0_12px_32px_rgba(102,126,234,0.2)] before:content-[''] before:absolute before:inset-0 before:rounded-16 before:p-2 before:bg-gradient-to-br before:from-[#667eea] before:to-[#764ba2] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:opacity-30 before:transition-opacity hover:before:opacity-100"
          >
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={400}
                height={240}
                className="w-full h-60 object-cover rounded-12 mb-20"
              />
            )}
            <div className="flex items-center gap-12 mb-16">
              <span className="text-sm text-gray-500 font-medium">
                {new Date(post.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
              {post.tags[0] && (
                <span className="inline-block bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)] text-[#667eea] px-10 py-4 rounded-6 text-xs font-semibold uppercase tracking-wider">
                  {post.tags[0]}
                </span>
              )}
            </div>
            <h3 className="text-20 md:text-24 font-bold text-[#1a202c] mb-12 leading-snug">{post.title}</h3>
            <p className="text-base text-[#4a5568] leading-relaxed mb-0 line-clamp-3">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
