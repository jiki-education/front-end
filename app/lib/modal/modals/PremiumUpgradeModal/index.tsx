"use client";

import { useEffect, useState } from "react";
import { hideModal } from "../../store";
import { useAuthStore } from "@/lib/auth/authStore";
import { trackEvent, type ModalTrigger } from "@/lib/analytics";
import { BasicPlanSection } from "./BasicPlanSection";
import { PremiumPlanSection } from "./PremiumPlanSection";
import { useUpgradeFlow } from "./useUpgradeFlow";
import styles from "./PremiumUpgradeModal.module.css";
import Image from "next/image";

interface PremiumUpgradeModalProps {
  trigger?: ModalTrigger;
  contextType?: string;
  contextId?: string | number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PremiumUpgradeModal({
  trigger,
  contextType,
  contextId,
  onSuccess,
  onCancel
}: PremiumUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state: any) => state.user);

  useEffect(() => {
    trackEvent("premium_modal_shown", {
      trigger: trigger ?? null,
      context_type: contextType ?? null,
      context_id: contextId ?? null
    });
    // If the modal stays mounted while showModal is called again with a new
    // trigger (rare but possible — the global provider doesn't always
    // remount), refire so the funnel reflects the new context rather than
    // recording the old one.
  }, [trigger, contextType, contextId]);

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
