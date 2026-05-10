"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { showModal } from "@/lib/modal";
import { Button } from "@/components/ui-kit/Button";
import styles from "./PremiumPage.module.css";

export default function CtaSection() {
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.membership_type === "premium";

  if (isPremium) {
    return (
      <div className={styles["cta-wrapper"]}>
        <div className={styles["cta-banner"]}>
          <h2 className={styles["cta-title"]}>You&apos;re already a Premium member</h2>
          <p className={styles["cta-desc"]}>Thanks for supporting Jiki — enjoy full access to everything!</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles["cta-wrapper"]}>
        <div className={styles["cta-banner"]}>
          <h2 className={styles["cta-title"]}>Ready to accelerate your learning?</h2>
          <p className={styles["cta-desc"]}>Upgrade to Premium and unlock everything Jiki has to offer.</p>
          <Button variant="white" onClick={() => showModal("premium-upgrade-modal")}>
            Upgrade to Premium
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["cta-wrapper"]}>
      <div className={styles["cta-banner"]}>
        <h2 className={styles["cta-title"]}>Get started for free</h2>
        <p className={styles["cta-desc"]}>
          Get started today for free and access hundreds of hours of free content. Upgrade to Premium when you want to
          go even deeper.
        </p>
        <Button variant="white" onClick={() => (window.location.href = "/auth/signup")}>
          Sign up for free
        </Button>
      </div>
    </div>
  );
}
