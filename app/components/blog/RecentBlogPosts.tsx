import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/content/types";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./RecentBlogPosts.module.css";

interface RecentBlogPostsProps {
  posts: BlogPostMeta[];
}

export default function RecentBlogPosts({ posts }: RecentBlogPostsProps) {
  const routes = useLocaleRoutes();
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Recent Posts</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={routes.blogPost(post.slug)} className={styles.card}>
            {post.coverImage && (
              <Image src={post.coverImage} alt={post.title} width={400} height={240} className={styles.image} />
            )}
            <div className={styles.meta}>
              <span className={styles.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
              {post.tags[0] && <span className={styles.tag}>{post.tags[0]}</span>}
            </div>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.excerpt}>{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
