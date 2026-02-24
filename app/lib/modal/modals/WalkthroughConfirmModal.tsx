import LearningSettingsIcon from "@/icons/learning-settings.svg";
import ChatIcon from "@/icons/chat.svg";
import EyeOpenIcon from "@/icons/eye-open.svg";
import ProjectsIcon from "@/icons/projects.svg";
import { hideModal } from "../store";
import styles from "./WalkthroughConfirmModal.module.css";

interface WalkthroughConfirmModalProps {
  onConfirm?: () => void;
}

export function WalkthroughConfirmModal({ onConfirm }: WalkthroughConfirmModalProps) {
  const handleWatch = () => {
    hideModal();
    onConfirm?.();
  };

  return (
    <div className={styles.content}>
      <h4>Try solving it yourself first?</h4>
      <p>Before watching the walkthrough, you might want use these resources to help you pass the tests yourself:</p>
      <ul className={styles.resources}>
        <li>
          <span className={`${styles.resourceIcon} ${styles.blue}`}>
            <LearningSettingsIcon width={16} height={16} />
          </span>
          <p>
            <strong>Concept Pages</strong> — review the concepts used in this exercise
          </p>
        </li>
        <li>
          <span className={`${styles.resourceIcon} ${styles.purple}`}>
            <ChatIcon width={16} height={16} />
          </span>
          <p>
            <strong>Ask Jiki</strong> — get personalised help from Jiki without spoilers
          </p>
        </li>
        <li>
          <span className={`${styles.resourceIcon} ${styles.green}`}>
            <EyeOpenIcon width={16} height={16} />
          </span>
          <p>
            <strong>&ldquo;What happened?&rdquo; tips</strong> — step through your code line by line to see what went
            wrong
          </p>
        </li>
        <li>
          <span className={`${styles.resourceIcon} ${styles.amber}`}>
            <ProjectsIcon width={16} height={16} />
          </span>
          <p>
            <strong>Reveal all the Hints</strong> — read through all the hints above for guidance
          </p>
        </li>
      </ul>
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-tertiary" onClick={hideModal}>
          I&apos;ll try first
        </button>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={handleWatch}>
          Watch walkthrough
        </button>
      </div>
    </div>
  );
}
