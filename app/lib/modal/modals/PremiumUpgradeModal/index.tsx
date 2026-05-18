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
  // Backend stores three type-accurate fields and never both at once.
  // Pass `contextSlug` for slug-keyed entities (lesson, project) and
  // `contextUuid` for uuid-keyed ones (episode). `context_id` is the
  // backend's integer PK — materialised server-side, never sent here.
  contextSlug?: string;
  contextUuid?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PremiumUpgradeModal({
  trigger,
  contextType,
  contextSlug,
  contextUuid,
  onSuccess,
  onCancel
}: PremiumUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state: any) => state.user);

  useEffect(() => {
    // Omit absent keys rather than sending null — PostHog filters render
    // "null" as a literal value, which clutters the funnel. Backend's
    // events endpoint already treats missing keys as "not set".
    const properties: Record<string, unknown> = {};
    if (trigger) properties.trigger = trigger;
    if (contextType) properties.context_type = contextType;
    if (contextSlug) properties.context_slug = contextSlug;
    if (contextUuid) properties.context_uuid = contextUuid;
    trackEvent("premium_modal_shown", properties);
    // Refire if showModal is called again with new context while the modal
    // stays mounted — keeps the funnel honest in the rare reopen-without-
    // unmount case.
  }, [trigger, contextType, contextSlug, contextUuid]);

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
