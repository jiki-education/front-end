"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ProjectIcon } from "@/components/icons/ProjectIcon";
import UnlockedIcon from "@/icons/unlocked.svg";
import { launchConfetti, cleanupCanvas } from "@/lib/confetti";
import styles from "@/app/styles/components/modals.module.css";
import projectStyles from "@/app/styles/components/project-card.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

const FLIP_DURATION_MS = 1500;

interface ProjectUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  unlockedProject: {
    name: string;
    description: string;
    slug: string;
  };
  onContinue: () => void;
}

export function ProjectUnlockedStep({ completionResponse, unlockedProject, onContinue }: ProjectUnlockedStepProps) {
  const t = useTranslations("modals.exerciseCompletion.projectUnlocked");
  const unlockedProjectData = completionResponse.find((item) => item.type === "project_unlocked")?.data.project;

  const projectToShow = unlockedProjectData
    ? {
        name: unlockedProjectData.title,
        description: unlockedProjectData.description,
        slug: unlockedProjectData.slug
      }
    : unlockedProject;

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
      <div className={projectStyles.projectCardSimple}>
        <div className={projectStyles.projectCardSimpleBackground}></div>
        <div className={projectStyles.projectCardSimpleBack}>
          <UnlockedIcon className={projectStyles.projectCardSimpleBackIcon} />
        </div>
        <div className={projectStyles.projectCardSimpleFront}>
          <div className={projectStyles.projectCardSimpleNewLabel}>{t("newLabel")}</div>
          <div className={projectStyles.projectCardSimpleIcon}>
            <ProjectIcon slug={projectToShow.slug} />
          </div>
          <div className={projectStyles.projectCardSimpleName}>{projectToShow.name}</div>
          <div className={projectStyles.projectCardSimpleDescription}>{projectToShow.description}</div>
        </div>
      </div>
      <div className={styles.premiumInfoBox}>
        <p>
          <span className="font-semibold">{t("premiumOnly")}</span> <Link href="/premium">{t("upgradeLink")}</Link>
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
