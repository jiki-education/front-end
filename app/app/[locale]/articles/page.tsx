import { getAllArticles, getAvailableLocales } from "@jiki/content";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/config/locales";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  const locales = getAvailableLocales("articles");
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export default async function LocaleArticlesPage({ params }: Props) {
  const { locale } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect("/articles");
  }

  // Check if locale has any articles
  const locales = getAvailableLocales("articles");
  if (!locales.includes(locale)) {
    notFound();
  }

  const articles = getAllArticles(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Articles</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-lg border p-6 hover:shadow-lg">
            <Link href={`/${locale}/articles/${article.slug}`} className="group">
              <h2 className="mb-2 text-xl font-semibold group-hover:text-blue-600">{article.title}</h2>
            </Link>
            <p className="mb-4 text-sm text-gray-700">{article.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded bg-gray-200 px-2 py-1 text-xs">
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
