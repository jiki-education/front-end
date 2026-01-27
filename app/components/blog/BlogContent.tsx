"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";
import Pagination from "@/components/ui/Pagination";
import BlogPostCard from "./BlogPostCard";

interface BlogContentProps {
  blogPosts: ProcessedBlogPost[];
  locale: string;
  currentPage: number;
  totalPages: number;
}

export default function BlogContent({ blogPosts, locale, currentPage, totalPages }: BlogContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <>
      <div className="space-y-12">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>

      {blogPosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </>
  );
}
