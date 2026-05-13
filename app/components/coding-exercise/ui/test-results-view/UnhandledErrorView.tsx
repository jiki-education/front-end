import { CopyToClipboardButton } from "@/components/ui-kit/CopyToClipboardButton";
import { Icon } from "@/components/ui-kit/Icon";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import syntaxErrorStyles from "./SyntaxErrorView.module.css";
import styles from "./UnhandledErrorView.module.css";

export function UnhandledErrorView() {
  const orchestrator = useOrchestrator();
  const { unhandledErrorBase64 } = useOrchestratorStore(orchestrator);

  return (
    <div className={`${syntaxErrorStyles.container} ${styles.wrapper}`}>
      <Icon name="bug" size={48} className={styles.icon} color="gray-500" alt="An image of a bug" />
      <h3 className={syntaxErrorStyles.heading}>
        Oops! Something went <strong className={styles.headingStrong}>very</strong> wrong.
      </h3>
      <p className={`${syntaxErrorStyles.message} ${styles.body}`}>
        <strong className={styles.bodyStrong}>This is our error, not yours!</strong> Please tell us about this error so
        we can fix it. Please click the button below to copy the mysterious text to your clipboard, and share it with us
        on{" "}
        <a href="https://forum.jiki.io" target="_blank" rel="noreferrer">
          the forum
        </a>
        . Thank you! 💙
      </p>
      <CopyToClipboardButton textToCopy={unhandledErrorBase64} className={styles.copyButton} />
    </div>
  );
}
