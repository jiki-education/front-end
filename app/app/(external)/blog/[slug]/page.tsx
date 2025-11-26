import { getAllBlogPosts, getBlogPost } from "@jiki/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostContent from "./BlogPostContent";
import CTABlock from "@/components/blog/CTABlock";
import RelatedArticles from "@/components/blog/RelatedArticles";

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

  // Mock related posts from the reference design
  const relatedPosts = [
    {
      slug: "object-oriented-october",
      title: "It's Object Oriented October",
      date: "2023-10-01",
      excerpt:
        "This month we're exploring Object Oriented Languages including C#, Crystal, Ruby and PowerShell. Learn what makes each language unique and discover their standout features.",
      author: { name: "Jiki Team", bio: "", avatar: "" },
      tags: ["#12in23"],
      seo: { description: "", keywords: [] },
      featured: false,
      coverImage: "/api/placeholder/400/240",
      content: "",
      locale: "en"
    },
    {
      slug: "introducing-48in24",
      title: "Introducing #48in24",
      date: "2024-01-06",
      excerpt:
        "New year, new challenge! We're launching a year-long journey through 48 different exercises. Earn Bronze, Silver, and Gold awards by completing exercises across multiple languages.",
      author: { name: "Jiki Team", bio: "", avatar: "" },
      tags: ["#48in24"],
      seo: { description: "", keywords: [] },
      featured: false,
      coverImage: "/api/placeholder/400/240",
      content: "",
      locale: "en"
    },
    {
      slug: "appy-august",
      title: "It's Appy August!",
      date: "2023-08-01",
      excerpt:
        "Exploring 14 languages designed for building applications - from web apps to native mobile, desktop, and domain-specific applications. Discover ABAP, CoffeeScript, Dart, Elm, Java, JavaScript, and more!",
      author: { name: "Jiki Team", bio: "", avatar: "" },
      tags: ["#12in23"],
      seo: { description: "", keywords: [] },
      featured: false,
      coverImage: "/api/placeholder/400/240",
      content: "",
      locale: "en"
    }
  ];

  return (
    <>
      <BlogPostContent post={post} variant="unauthenticated" />

      {/* Minimal CTA */}
      <CTABlock
        variant="minimal"
        title="Try Jiki for free"
        subtitle="10,000+ learners use Jiki to master programming through hands-on practice and expert mentorship every month."
        buttonText="Get started now"
        buttonHref="/signup"
      />

      {/* Related Articles */}
      <RelatedArticles articles={relatedPosts} />

      {/* Gradient CTA */}
      <CTABlock
        variant="gradient"
        title="Ready to Start Your Coding Journey?"
        subtitle="Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your skills — it's free!"
        buttonText="Sign Up to Jiki"
        buttonHref="/signup"
      />
    </>
  );
}
