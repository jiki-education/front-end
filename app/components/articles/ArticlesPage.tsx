import { getAllArticles } from "@jiki/content";
import ArticlesContent from "./ArticlesContent";

interface ArticlesPageProps {
  authenticated: boolean;
  locale: string;
}

export default function ArticlesPage({ authenticated, locale }: ArticlesPageProps) {
  const articles = getAllArticles(locale);
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Articles</h1>
        <p className="text-lg text-gray-600">In-depth guides and tutorials for learning to code</p>
      </header>
      <ArticlesContent articles={articles} authenticated={authenticated} locale={locale} />
    </div>
  );
}
