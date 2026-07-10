import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import type { ProjectMeta } from "@/lib/content/types";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectMeta;
  locale: string;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const comingSoon = project.episodeCount === 0;
  const cardClassName = `${styles.card} ${comingSoon ? styles.cardComingSoon : ""}`;

  const content = (
    <>
      <Image
        src={`/static/images/projects/covers/${project.image}`}
        alt=""
        width={240}
        height={135}
        className={styles.cardImage}
      />
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardDescription}>{project.description}</p>
        <div className={styles.pillRow}>
          {project.audience && <span className={`${styles.pill} ${styles.pillAudience}`}>{project.audience}</span>}
          {project.cadence && <span className={`${styles.pill} ${styles.pillCadence}`}>{project.cadence}</span>}
        </div>
      </div>
      {comingSoon && (
        <div className={styles.comingSoonRibbon} aria-label="Coming soon">
          <span>Coming Soon</span>
        </div>
      )}
    </>
  );

  if (comingSoon) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <Link href={localePath(`/projects/${project.slug}`, locale)} className={cardClassName}>
      {content}
    </Link>
  );
}
