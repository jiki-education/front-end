import { getAllArticles } from "@jiki/content";
import Link from "next/link";

export default function ArticlesPage() {
  const articles = getAllArticles("en");

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
