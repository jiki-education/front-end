"use client";

import styles from "@/app/styles/components/modals.module.css";
import challengeStyles from "@/app/styles/components/challenge-card.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import UnlockedIcon from "@/icons/unlocked.svg";
import { cleanupCanvas, launchConfetti } from "@/lib/confetti";
import { fetchCurriculumCopy, resolveCopy } from "@/lib/api/curriculum-copy";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { reportError } from "@/lib/reportError";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const FLIP_DURATION_MS = 1500;

interface ChallengeUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  unlockedChallenge: {
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
  const tCommon = useTranslations("common");
  const routes = useLocaleRoutes();
  const locale = useLocale();
  const slug =
    completionResponse.find((item) => item.type === "challenge_unlocked")?.data.challenge?.slug ??
    unlockedChallenge.slug;
  const [copy, setCopy] = useState<{ title: string; description: string } | null>(null);

  // Title and description are curriculum copy, resolved by slug from the locale's
  // catalog like everywhere else challenges are rendered. The API sends identity only.
  useEffect(() => {
    let cancelled = false;
    fetchCurriculumCopy(locale)
      .then((catalog) => {
        if (!cancelled) {
          setCopy(resolveCopy(catalog, slug));
        }
      })
      .catch(reportError);
    return () => {
      cancelled = true;
    };
  }, [locale, slug]);

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
            <ChallengeIcon slug={slug} />
          </div>
          <div className={challengeStyles.challengeCardSimpleName}>{copy?.title ?? ""}</div>
          <div className={challengeStyles.challengeCardSimpleDescription}>{copy?.description ?? ""}</div>
        </div>
      </div>
      <div className={styles.premiumInfoBox}>
        <p>
          {t.rich("premiumInfo", {
            strong: (chunks) => <span className={styles.textSemibold}>{chunks}</span>,
            link: (chunks) => <Link href={routes.premium()}>{chunks}</Link>
          })}
        </p>
      </div>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onContinue} className={`ui-btn ui-btn-primary ui-btn-large ${styles.buttonFill}`}>
          {tCommon("continue")}
        </button>
      </div>
    </>
  );
}
