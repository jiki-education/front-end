"use client";

import styles from "@/app/styles/components/modals.module.css";
import challengeStyles from "@/app/styles/components/challenge-card.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import UnlockedIcon from "@/icons/unlocked.svg";
import { cleanupCanvas, launchConfetti } from "@/lib/confetti";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

const FLIP_DURATION_MS = 1500;

interface ChallengeUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  unlockedChallenge: {
    name: string;
    description: string;
    slug: string;
  };
  onContinue: () => void;
}

export function ChallengeUnlockedStep({
  completionResponse,
  unlockedChallenge,
  onContinue
}: ChallengeUnlockedStepProps) {
  const t = useTranslations("modals.exerciseCompletion.challengeUnlocked");
  const routes = useLocaleRoutes();
  const unlockedChallengeData = completionResponse.find((item) => item.type === "challenge_unlocked")?.data.challenge;

  const challengeToShow = unlockedChallengeData
    ? {
        name: unlockedChallengeData.title,
        description: unlockedChallengeData.description,
        slug: unlockedChallengeData.slug
      }
    : unlockedChallenge;

  useEffect(() => {
    const timer = setTimeout(launchConfetti, FLIP_DURATION_MS);
    return () => {
      clearTimeout(timer);
      cleanupCanvas();
    };
  }, []);

  return (
    <>
      <h2 className={styles.modalTitle}>{t("title")}</h2>
      <p className={styles.modalMessage}>{t("message")}</p>
      <div className={challengeStyles.challengeCardSimple}>
        <div className={challengeStyles.challengeCardSimpleBackground}></div>
        <div className={challengeStyles.challengeCardSimpleBack}>
          <UnlockedIcon className={challengeStyles.challengeCardSimpleBackIcon} />
        </div>
        <div className={challengeStyles.challengeCardSimpleFront}>
          <div className={challengeStyles.challengeCardSimpleNewLabel}>{t("newLabel")}</div>
          <div className={challengeStyles.challengeCardSimpleIcon}>
            <ChallengeIcon slug={challengeToShow.slug} />
          </div>
          <div className={challengeStyles.challengeCardSimpleName}>{challengeToShow.name}</div>
          <div className={challengeStyles.challengeCardSimpleDescription}>{challengeToShow.description}</div>
        </div>
      </div>
      <div className={styles.premiumInfoBox}>
        <p>
          <span className="font-semibold">{t("premiumOnly")}</span>{" "}
          <Link href={routes.premium()}>{t("upgradeLink")}</Link>
          {t("premiumInfoSuffix")}
        </p>
      </div>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onContinue} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {t("continue")}
        </button>
      </div>
    </>
  );
}
