import { getAllBlogPosts } from "@jiki/content";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

const SUPPORTED_LOCALES = ["hu"]; // Only non-English locales

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleBlogPage({ params }: Props) {
  const { locale } = await params;

  // Redirect en to naked URL
  if (locale === "en") {
    redirect("/blog");
  }

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const blogPosts = getAllBlogPosts(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <Link href={`/${locale}/blog/${post.slug}`} className="group">
              <h2 className="mb-2 text-2xl font-semibold group-hover:text-blue-600">{post.title}</h2>
            </Link>
            <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <span>By {post.author.name}</span>
            </div>
            <p className="mb-4 text-gray-700">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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
