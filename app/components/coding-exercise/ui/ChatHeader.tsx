import { PanelHeader } from "./PanelHeader";
import styles from "./ChatHeader.module.css";

export function ChatHeader() {
  return (
    <div className={styles.chatHeader}>
      <PanelHeader title="Talk to Jiki" description="Ask questions and get help from your AI coding assistant" />
    </div>
  );
}
