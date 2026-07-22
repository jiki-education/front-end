import { useTranslations } from "next-intl";
import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import styles from "./shared.module.css";

export default function StuckHeader() {
  const t = useTranslations("codingExercise.stuckHeader");
  return (
    <>
      <div className={styles.avatar}>
        <ChatBubbleIcon width={32} height={32} />
      </div>
      <h3 className={styles.title}>{t("title")}</h3>
    </>
  );
}
