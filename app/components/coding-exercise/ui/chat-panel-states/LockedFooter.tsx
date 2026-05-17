"use client";

import Link from "next/link";
import { showPremiumUpgradeModal } from "@/lib/modal";
import styles from "./LockedFooter.module.css";

type LockedFooterVariant = "free-limit-reached" | "premium-blocked";

interface LockedFooterProps {
  variant: LockedFooterVariant;
}

// The footer shown beneath a locked conversation:
// - free-limit-reached: non-premium user who has used their free conversation
// - premium-blocked: premium user who hit fair use limits
export function LockedFooter({ variant }: LockedFooterProps) {
  const handleUpgradeClick = () => {
    showPremiumUpgradeModal("assistant_limit_reached");
  };

  return (
    <div className={styles.footer}>
      <div className={styles.footerBox}>
        {variant === "free-limit-reached" ? (
          <p className={styles.footerText}>
            You&apos;re no longer on the Premium Plan.{" "}
            <button onClick={handleUpgradeClick} className={styles.upgradeLink}>
              Upgrade
            </button>{" "}
            to continue the conversation.
          </p>
        ) : (
          <>
            <p className={styles.footerText}>You&apos;ve hit our fair use limits. Please try again tomorrow.</p>
            <p className={styles.footerLink}>
              <Link href="/fair-use-limits" className={styles.footerLinkGray}>
                Learn more about fair use limits
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
