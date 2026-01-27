import Image from "next/image";
import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import CheckCircleFilledIcon from "@/icons/check-circle-filled.svg";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import styles from "./FreeUserCanStart.module.css";

interface FreeUserCanStartProps {
  onStartChat: () => void;
}

// Non-premium user, conversation allowed, no existing conversation
// This is their first free conversation opportunity
export default function FreeUserCanStart({ onStartChat }: FreeUserCanStartProps) {
  const handleStartChat = () => {
    showModal("confirmation-modal", {
      title: "Get Jiki's help",
      message:
        "You can only Talk to Jiki on one exercise with the Free plan. Are you sure you want to use it on this exercise?",
      cancelText: "No, not yet",
      confirmText: "Yes, let's go",
      onConfirm: onStartChat
    });
  };

  const handleUpgradeClick = () => {
    showModal("premium-upgrade-modal", {}, undefined, premiumModalStyles.premiumModalWidth);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <ChatBubbleIcon width={32} height={32} />
        </div>

        <h3 className={styles.title}>Feeling Stuck? Talk to Jiki!</h3>
        <p className={styles.description}>
          Work with Jiki to understand whatever&apos;s confusing you. You can use Jiki AI once on the Free plan.{" "}
          <button onClick={handleUpgradeClick} className={styles.upgradeLink}>
            Upgrade to <span className={styles.premiumText}>Jiki Premium</span>
          </button>{" "}
          for unlimited usage.
        </p>

        <div className={styles.buttonWrapper}>
          <Image src="/static/images/misc/arrow.png" alt="" width={60} height={60} className={styles.arrow} />
          <button onClick={handleStartChat} className="ui-btn ui-btn-primary ui-btn-purple ui-btn-default">
            <ChatBubbleIcon width={20} height={20} />
            Start Talking to Jiki
          </button>
        </div>

        <p className={styles.includedText}>
          <CheckCircleFilledIcon width={18} height={18} className={styles.checkIcon} />
          Included in your Free plan
        </p>
      </div>
    </div>
  );
}
