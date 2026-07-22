import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedBlogPost, BlogPostMeta } from "@/lib/content/types";
import BlogPostHeader from "./BlogPostHeader";
import RelatedPosts from "./RelatedPosts";
import shared from "@/components/landing-page/shared.module.css";
import styles from "@/components/ui/ContentWithSidebar.module.css";

interface BlogPostContentProps {
  post: ProcessedBlogPost;
  variant?: "authenticated" | "unauthenticated";
  relatedPosts?: BlogPostMeta[];
  locale?: string;
}

export default function BlogPostContent({ post, relatedPosts, locale = "en" }: BlogPostContentProps) {
  const hasRelatedPosts = relatedPosts && relatedPosts.length > 0;

  return (
    <div className={styles.mainContent}>
      <BlogPostHeader post={post} />
      {hasRelatedPosts ? (
        <div className={styles.contentWrapper}>
          <div className={`${shared["lg-container"]} ${styles.contentWrapperInner}`}>
            <article className={styles.articleContent}>
              <MarkdownContent content={post.content} className="blog-post-content" />
            </article>
            <aside className={styles.rightPanel}>
              <RelatedPosts posts={relatedPosts} locale={locale} />
            </aside>
          </div>
        </div>
      ) : (
        <div className={styles.contentWrapperFull}>
          <div className={`${shared["lg-container"]} ${styles.contentWrapperFullInner}`}>
            <article className={styles.articleContent}>
              <MarkdownContent content={post.content} className="blog-post-content" />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
