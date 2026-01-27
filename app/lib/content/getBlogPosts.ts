import type { ProcessedBlogPost } from "./generated/types";
import { getAllBlogPosts } from "./getAllBlogPosts";

const BLOG_POSTS_PAGE_SIZE = 10;

export interface GetBlogPostsOptions {
  locale?: string;
  page?: number;
}

export interface GetBlogPostsResult {
  posts: ProcessedBlogPost[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Get blog posts with pagination
 * Returns posts sorted by date (newest first)
 */
export async function getBlogPosts(options: GetBlogPostsOptions = {}): Promise<GetBlogPostsResult> {
  const { locale = "en", page = 1 } = options;

  const allPosts = await getAllBlogPosts(locale);

  const totalCount = allPosts.length;
  const totalPages = Math.ceil(totalCount / BLOG_POSTS_PAGE_SIZE);

  // Paginate
  const start = (page - 1) * BLOG_POSTS_PAGE_SIZE;
  const paginatedPosts = allPosts.slice(start, start + BLOG_POSTS_PAGE_SIZE);

  return {
    posts: paginatedPosts,
    totalCount,
    totalPages,
    currentPage: page
  };
}
