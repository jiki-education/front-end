import { getAllArticles, getArticle } from "@jiki/content";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const SUPPORTED_LOCALES = ["hu"]; // Only non-English locales

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    const articles = getAllArticles(locale);
    for (const article of articles) {
      params.push({ locale, slug: article.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === "en") {
    return { title: "Redirecting..." };
  }

  try {
    const article = getArticle(slug, locale);
    return {
      title: article.title,
      description: article.seo.description,
      keywords: article.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function LocaleArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  // Redirect en to naked URL
  if (locale === "en") {
    redirect(`/articles/${slug}`);
  }

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  let article;
  try {
    article = getArticle(slug, locale);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-lg mx-auto">
        <header className="mb-8">
          <h1 className="mb-4">{article.title}</h1>
          {article.coverImage && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
            </div>
          )}
          <div className="mb-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded bg-gray-200 px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </div>
  );
}
