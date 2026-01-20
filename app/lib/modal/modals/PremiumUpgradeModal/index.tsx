"use client";

import { useState } from "react";
import { hideModal } from "../../store";
import { useAuthStore } from "@/lib/auth/authStore";
import type { MembershipTier } from "@/lib/pricing";
import { BasicPlanSection } from "./BasicPlanSection";
import { PremiumPlanSection } from "./PremiumPlanSection";
import { useUpgradeFlow } from "./useUpgradeFlow";
import styles from "./PremiumUpgradeModal.module.css";
import Image from "next/image";

interface PremiumUpgradeModalProps {
  onSuccess?: (tier: MembershipTier) => void;
  onCancel?: () => void;
}

export function PremiumUpgradeModal({ onSuccess, onCancel }: PremiumUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state: any) => state.user);

  const { handleUpgrade } = useUpgradeFlow({
    setIsLoading,
    onSuccess,
    onCancel
  });

  const handleClose = () => {
    onCancel?.();
    hideModal();
  };

  return (
    <div className={styles.modalContent}>
      <Image
        className={styles.arrowDecoration}
        src="/static/images/misc/arrow.png"
        alt=""
        width={150}
        height={150}
        priority
      />

      <div className={styles.plansContainer}>
        <BasicPlanSection />
        <PremiumPlanSection user={user} isLoading={isLoading} onUpgrade={handleUpgrade} />
      </div>

      <button className={styles.skipLink} onClick={handleClose}>
        Not now, maybe later
      </button>
    </div>
  );
}
