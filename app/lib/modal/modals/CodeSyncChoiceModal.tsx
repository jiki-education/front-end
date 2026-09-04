import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import { diffLines, type DiffCell } from "./lineDiff";
import styles from "./CodeSyncChoiceModal.module.css";

interface CodeSyncChoiceModalProps {
  localCode: string;
  serverCode: string;
  onChoose: (choice: "local" | "server") => void;
}

export function CodeSyncChoiceModal({ localCode, serverCode, onChoose }: CodeSyncChoiceModalProps) {
  const t = useTranslations("modals.codeSyncChoice");
  const rows = diffLines(localCode, serverCode);

  const choose = (choice: "local" | "server") => {
    hideModal();
    onChoose(choice);
  };

  return (
    <div className={styles.content}>
      <h4>{t("title")}</h4>
      <p>{t("intro")}</p>
      <div className={styles.columns}>
        <h5>{t("localLabel")}</h5>
        <h5>{t("serverLabel")}</h5>
      </div>
      <div className={styles.diff}>
        <CodePane side={styles.local} cells={rows.map((row) => row.left)} />
        <CodePane side={styles.server} cells={rows.map((row) => row.right)} />
      </div>
      <div className={styles.columns}>
        <button className="ui-btn ui-btn-default ui-btn-tertiary" onClick={() => choose("local")}>
          {t("useLocal")}
        </button>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={() => choose("server")}>
          {t("useServer")}
        </button>
      </div>
    </div>
  );
}

function CodePane({ side, cells }: { side: string; cells: (DiffCell | null)[] }) {
  return (
    <pre className={`${styles.pane} ${side}`}>
      {cells.map((cell, i) => (
        <div key={i} className={lineClass(cell)}>
          {cell?.text}
        </div>
      ))}
    </pre>
  );
}

function lineClass(cell: DiffCell | null): string {
  if (cell === null) {
    return `${styles.line} ${styles.spacer}`;
  }
  return cell.changed ? `${styles.line} ${styles.changed}` : styles.line;
}
