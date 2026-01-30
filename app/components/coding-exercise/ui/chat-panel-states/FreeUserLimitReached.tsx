import Image from "next/image";
import ChatBubbleIcon from "@/icons/chat-bubble.svg";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import styles from "./FreeUserCanStart.module.css";

// Non-premium user, conversation not allowed, no existing conversation
// They've used their free conversation limit
export default function FreeUserLimitReached() {
  const handleUpgradeClick = () => {
    showModal(
      "premium-upgrade-modal",
      {},
      premiumModalStyles.premiumModalOverlay,
      premiumModalStyles.premiumModalWidth
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <ChatBubbleIcon width={32} height={32} />
        </div>

        <h3 className={styles.title}>Feeling Stuck? Talk to Jiki!</h3>
        <p className={styles.description}>
          You&apos;ve used your free conversation. Continue learning with Jiki&apos;s help with concepts, debugging, and
          moving forward on exercises.
        </p>

        <div className={styles.buttonWrapper}>
          <Image src="/static/images/misc/arrow.png" alt="" width={60} height={60} className={styles.arrow} />
          <button onClick={handleUpgradeClick} className="ui-btn ui-btn-primary ui-btn-purple ui-btn-default">
            Upgrade to Jiki Premium
          </button>
        </div>

        <p className={styles.subtleText}>Just £3.99/month!</p>
      </div>
    </div>
  );
}
