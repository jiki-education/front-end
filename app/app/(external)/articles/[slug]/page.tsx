import { getAllArticles, getArticle } from "@jiki/content";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

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
