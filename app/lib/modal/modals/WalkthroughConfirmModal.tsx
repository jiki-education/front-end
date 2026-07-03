import LearningSettingsIcon from "@/icons/learning-settings.svg";
import ChatIcon from "@/icons/chat.svg";
import EyeOpenIcon from "@/icons/eye-open.svg";
import ProjectsIcon from "@/icons/projects.svg";
import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import styles from "./WalkthroughConfirmModal.module.css";

interface WalkthroughConfirmModalProps {
  onConfirm?: () => void;
}

export function WalkthroughConfirmModal({ onConfirm }: WalkthroughConfirmModalProps) {
  const t = useTranslations("modals.walkthroughConfirm");
  const handleWatch = () => {
    hideModal();
    onConfirm?.();
  };

  return (
    <div className={styles.content}>
      <h4>{t("title")}</h4>
      <p>{t("intro")}</p>
      <ul className={styles.resources}>
        <li>
          <span className={`${styles.resourceIcon} ${styles.blue}`}>
            <LearningSettingsIcon width={16} height={16} />
          </span>
          <p>
            <strong>{t("conceptPagesLabel")}</strong>
            {t("conceptPagesText")}
          </p>
        </li>
        <li>
          <span className={`${styles.resourceIcon} ${styles.purple}`}>
            <ChatIcon width={16} height={16} />
          </span>
          <p>
            <strong>{t("askJikiLabel")}</strong>
            {t("askJikiText")}
          </p>
        </li>
        <li>
          <span className={`${styles.resourceIcon} ${styles.green}`}>
            <EyeOpenIcon width={16} height={16} />
          </span>
          <p>
            <strong>{t("whatHappenedLabel")}</strong>
            {t("whatHappenedText")}
          </p>
        </li>
        <li>
          <span className={`${styles.resourceIcon} ${styles.amber}`}>
            <ProjectsIcon width={16} height={16} />
          </span>
          <p>
            <strong>{t("revealHintsLabel")}</strong>
            {t("revealHintsText")}
          </p>
        </li>
      </ul>
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-tertiary" onClick={hideModal}>
          {t("tryFirst")}
        </button>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={handleWatch}>
          {t("watchDeepDive")}
        </button>
      </div>
    </div>
  );
}
