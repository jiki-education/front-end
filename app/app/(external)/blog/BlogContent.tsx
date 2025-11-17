"use client";

import Sidebar from "@/components/index-page/sidebar/Sidebar";
import { useAuth } from "@/lib/auth/hooks";
import Link from "next/link";
import type { ProcessedPost } from "@jiki/content";

interface BlogContentProps {
  blogPosts: ProcessedPost[];
}

export default function BlogContent({ blogPosts }: BlogContentProps) {
  const { isAuthenticated, isReady } = useAuth();

  const shouldShowSidebar = isReady && isAuthenticated;

  if (shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-bg-secondary theme-transition">
        <Sidebar activeItem="blog" />
        <div className="ml-[260px]">
          <main className="p-6">
            <header className="mb-12">
              <h1 className="mb-4 text-5xl font-bold text-text-primary">Blog</h1>
              <p className="text-lg text-text-secondary">Thoughts, tutorials, and insights about coding</p>
            </header>
            <div className="space-y-12">
              {blogPosts.map((post) => (
                <article key={post.slug} className="border-b border-border-primary pb-12 last:border-0">
                  <Link href={`/blog/${post.slug}`} className="group">
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
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Blog</h1>
        <p className="text-lg text-gray-600">Thoughts, tutorials, and insights about coding</p>
      </header>
      <div className="space-y-12">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b border-gray-200 pb-12 last:border-0">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="mb-3 text-3xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <span>•</span>
              <span>By {post.author.name}</span>
            </div>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
