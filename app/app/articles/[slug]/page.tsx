import { getAllArticles, getArticle } from "@jiki/content";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/content/MarkdownContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const articles = getAllArticles("en");
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = getArticle(slug, "en");
    return {
      title: article.title,
      description: article.seo.description,
      keywords: article.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = getArticle(slug, "en");
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <article>
        <header className="mb-12">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">{article.title}</h1>
          {article.coverImage && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
              <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {tag}
              </span>
            ))}
          </div>
        </header>
        <MarkdownContent content={article.content} />
      </article>
    </div>
  );
}
