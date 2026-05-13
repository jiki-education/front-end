import { type ProjectData } from "@/lib/api/projects";
import { ProjectIcon } from "@/components/icons/ProjectIcon";
import LockIcon from "@/icons/lock.svg";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import styles from "./ProjectCard.module.css";

interface PremiumProjectCardProps {
  project: ProjectData & {
    iconUrl?: string;
    skills?: string;
  };
}

export function PremiumProjectCard({ project }: PremiumProjectCardProps) {
  const handleClick = () => {
    showModal(
      "premium-upgrade-modal",
      {},
      premiumModalStyles.premiumModalOverlay,
      premiumModalStyles.premiumModalWidth
    );
  };

  return (
    <button type="button" onClick={handleClick} className={styles.cardButton}>
      <div className={styles.card} data-state="premium-locked">
        <div className={styles.statusBadge}>
          <LockIcon className={styles.statusBadgeIcon} />
          Premium Only
        </div>
        <div className={styles.hero}>
          <div className={styles.projectIcon}>
            <ProjectIcon slug={project.slug} />
          </div>
          <div className={styles.projectTitle}>{project.title}</div>
          <div className={styles.projectKind}>Coding Project</div>
        </div>
        <div className={styles.content}>
          <div className={styles.projectTitle}>{project.title}</div>
          <div className={styles.description}>{project.description}</div>
          {project.skills && (
            <div className={styles.statsRow}>
              <span className={styles.skills}>{project.skills}</span>
            </div>
          )}
        </div>
        <div className={styles.actionLink}></div>
      </div>
    </button>
  );
}
