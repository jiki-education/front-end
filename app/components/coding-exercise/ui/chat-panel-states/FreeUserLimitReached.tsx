import Image from "next/image";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import styles from "./shared.module.css";
import StuckHeader from "./StuckHeader";

// Non-premium user, conversation not allowed, no existing conversation
// They've used their free conversation limit
export default function FreeUserLimitReached() {
  const handleUpgradeClick = () => {
    showPremiumUpgradeModal("assistant_limit_reached");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <StuckHeader />
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
