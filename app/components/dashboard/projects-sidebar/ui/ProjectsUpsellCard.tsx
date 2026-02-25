import { ProjectIcon } from "@/components/icons/ProjectIcon";
import styles from "./ProjectsUpsellCard.module.css";

interface ProjectsUpsellCardProps {
  onUpgradeClick: () => void;
}

export function ProjectsUpsellCard({ onUpgradeClick }: ProjectsUpsellCardProps) {
  return (
    <div className={styles.card} onClick={onUpgradeClick}>
      <div className={styles.stack}>
        <div className={styles.fanCard}>
          <ProjectIcon slug="fallback" width={36} height={36} />
        </div>
        <div className={styles.fanCard}>
          <ProjectIcon slug="fallback" width={36} height={36} />
        </div>
        <div className={styles.fanCard}>
          <ProjectIcon slug="fallback" width={36} height={36} />
        </div>
        <div className={styles.fanCard}>
          <span className={styles.fanMore}>+6</span>
        </div>
      </div>
      <div className={styles.title}>New Projects Await!</div>
      <div className={styles.subtitle}>Combine your skills and challenge yourself with Premium Projects.</div>
    </div>
  );
}
