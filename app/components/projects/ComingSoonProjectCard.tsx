import Image from "next/image";
import type { ProjectMeta } from "@/lib/content/types";
import styles from "./ComingSoonProjectCard.module.css";

interface ComingSoonProjectCardProps {
  project: ProjectMeta;
}

/**
 * Compact, non-clickable teaser for a project that has no episodes yet.
 * Used in sidebars; the full-width portfolio treatment lives in ProjectCard.
 */
export default function ComingSoonProjectCard({ project }: ComingSoonProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={`/static/images/projects/covers/${project.image}`}
          alt=""
          width={360}
          height={202}
          className={styles.image}
        />
        <span className={styles.badge}>Coming Soon</span>
      </div>
      <h4 className={styles.title}>{project.title}</h4>
      <p className={styles.description}>{project.description}</p>
    </div>
  );
}
