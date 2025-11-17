"use client";

import { getAllArticles } from "@jiki/content";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import { useAuth } from "@/lib/auth/hooks";
import Link from "next/link";

export default function ArticlesPage() {
  const { isAuthenticated, isReady } = useAuth();
  const articles = getAllArticles("en");

  const shouldShowSidebar = isReady && isAuthenticated;

  if (shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-bg-secondary theme-transition">
        <Sidebar activeItem="articles" />
        <div className="ml-[260px]">
          <main className="p-6">
            <header className="mb-12">
              <h1 className="mb-4 text-5xl font-bold text-text-primary">Articles</h1>
              <p className="text-lg text-text-secondary">In-depth guides and tutorials for learning to code</p>
            </header>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="mb-3 text-xl font-bold text-text-primary transition-colors group-hover:text-link-primary">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="mb-4 line-clamp-3 text-text-secondary">{article.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-info-bg px-3 py-1 text-xs text-info-text">
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
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Articles</h1>
        <p className="text-lg text-gray-600">In-depth guides and tutorials for learning to code</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
          >
            <Link href={`/articles/${article.slug}`}>
              <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                {article.title}
              </h2>
            </Link>
            <p className="mb-4 line-clamp-3 text-gray-700">{article.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
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
