import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { localePath } from "@/lib/i18n/routes";
import { staticAsset } from "@/lib/static-asset";
import type { ProjectMeta } from "@/lib/content/types";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectMeta;
  locale: string;
  // Cover image blurred behind the localized banner for coming-soon cards.
  comingSoonCover?: string;
}

export default function ProjectCard({ project, locale, comingSoonCover }: ProjectCardProps) {
  const t = useTranslations("projects.projectCard");
  const comingSoon = project.episodeCount === 0;
  const cardClassName = `${styles.card} ${comingSoon ? styles.cardComingSoon : ""}`;
  const coverImage = comingSoon ? (comingSoonCover ?? project.image) : project.image;

  const content = (
    <>
      <div className={styles.cardThumbnail}>
        <Image
          src={staticAsset(`images/projects/covers/${coverImage}`)}
          alt=""
          width={240}
          height={135}
          className={`${styles.cardImage} ${comingSoon ? styles.cardImageComingSoon : ""}`}
        />
        {comingSoon && (
          <div className={styles.comingSoonBanner}>
            <span>{t("comingSoon")}</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardDescription}>{project.description}</p>
        {project.tags.length > 0 && (
          <div className={styles.pillRow}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.pill}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {comingSoon && (
        <div className={styles.comingSoonRibbon} aria-label={t("comingSoonLabel")}>
          <span>{t("comingSoon")}</span>
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
