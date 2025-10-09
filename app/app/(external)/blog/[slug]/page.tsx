import { getAllBlogPosts, getBlogPost } from "@jiki/content";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/content/MarkdownContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const blogPosts = getAllBlogPosts("en");
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getBlogPost(slug, "en");
    return {
      title: post.title,
      description: post.seo.description,
      keywords: post.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getBlogPost(slug, "en");
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <article>
        <header className="mb-12">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">{post.title}</h1>
          <div className="mb-6 flex items-center gap-4 text-gray-600">
            <time dateTime={post.date} className="text-sm">
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span className="text-sm">•</span>
            <span className="text-sm">By {post.author.name}</span>
          </div>
          {post.coverImage && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {tag}
              </span>
            ))}
          </div>
        </header>
        <MarkdownContent content={post.content} />
      </article>
    </div>
  );
}
