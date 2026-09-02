import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedBlogPost, BlogPostMeta } from "@/lib/content/types";
import BlogPostHeader from "./BlogPostHeader";
import RelatedPosts from "./RelatedPosts";
import shared from "@/components/landing-page/shared.module.css";
import styles from "@/components/ui/ContentWithSidebar.module.css";

interface BlogPostContentProps {
  post: ProcessedBlogPost;
  relatedPosts: BlogPostMeta[];
  locale: string;
}

export default function BlogPostContent({ post, relatedPosts, locale }: BlogPostContentProps) {
  return (
    <div className={styles.mainContent}>
      <BlogPostHeader post={post} />
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
    </div>
  );
}
