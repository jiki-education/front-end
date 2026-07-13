import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import styles from "./shared.module.css";

export default function StuckHeader() {
  return (
    <>
      <div className={styles.avatar}>
        <ChatBubbleIcon width={32} height={32} />
      </div>
      <h3 className={styles.title}>Feeling Stuck? Ask Jiki!</h3>
    </>
  );
}
