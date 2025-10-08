import { getBlogPost, getAllPostSlugsWithLocales } from "@jiki/content";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/config/locales";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllPostSlugsWithLocales("blog")
    .filter((p) => p.locale !== DEFAULT_LOCALE)
    .map((p) => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === DEFAULT_LOCALE) {
    return { title: "Redirecting..." };
  }

  try {
    const post = getBlogPost(slug, locale);
    return {
      title: post.title,
      description: post.seo.description,
      keywords: post.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function LocaleBlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect(`/blog/${slug}`);
  }

  let post;
  try {
    post = getBlogPost(slug, locale);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-lg mx-auto">
        <header className="mb-8">
          <h1 className="mb-4">{post.title}</h1>
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span>By {post.author.name}</span>
          </div>
          {post.coverImage && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded bg-gray-200 px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
