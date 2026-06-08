import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import styles from "./FreeUserCanStart.module.css";

interface StuckHeaderProps {
  title?: string;
}

export default function StuckHeader({ title = "Feeling Stuck? Talk to Jiki!" }: StuckHeaderProps) {
  return (
    <>
      <div className={styles.avatar}>
        <ChatBubbleIcon width={32} height={32} />
      </div>
      <h3 className={styles.title}>{title}</h3>
    </>
  );
}
