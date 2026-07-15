import { useTranslations } from "next-intl";
import { showConfirmation } from "@/lib/modal";
import UndoArrowIcon from "@/icons/undo-arrow.svg";
import Tooltip from "@/components/ui/Tooltip";
import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";
import styles from "../CodingExercise.module.css";

export default function RunButton() {
  const t = useTranslations("codingExercise.runButton");
  const tCommon = useTranslations("common");
  const orchestrator = useOrchestrator();
  const { status } = useOrchestratorStore(orchestrator);

  const handleRunCode = () => {
    void orchestrator.runCode();
  };

  const handleReset = () => {
    showConfirmation({
      title: t("resetConfirmTitle"),
      message: t("resetConfirmMessage"),
      confirmText: t("resetConfirmButton"),
      cancelText: tCommon("cancel"),
      onConfirm: () => orchestrator.resetExercise()
    });
  };

  return (
    <div className={styles.runButtonBlock}>
      <Tooltip content={t("resetTooltip")}>
        <button
          data-testid="reset-button"
          onClick={handleReset}
          className={styles.pillBtnReset}
          aria-label={t("resetAriaLabel")}
        >
          <UndoArrowIcon width={16} height={16} />
        </button>
      </Tooltip>
      <button
        data-testid="run-button"
        onClick={handleRunCode}
        disabled={status === "running"}
        className={styles.pillBtnRun}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        {status === "running" ? t("running") : t("run")}
      </button>
    </div>
  );
}
