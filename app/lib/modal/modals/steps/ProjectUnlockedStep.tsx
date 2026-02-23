"use client";

import { useEffect } from "react";
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
  onGoToDashboard: () => void;
}

export function ProjectUnlockedStep({
  completionResponse,
  unlockedProject,
  onGoToDashboard
}: ProjectUnlockedStepProps) {
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
      <h2 className={styles.modalTitle}>Project unlocked!</h2>
      <p className={styles.modalMessage}>
        All that practice means you&apos;re ready to combine what you&apos;ve learned in a new project.
      </p>
      <div className={projectStyles.projectCardSimple}>
        <div className={projectStyles.projectCardSimpleBackground}></div>
        <div className={projectStyles.projectCardSimpleBack}>
          <UnlockedIcon className={projectStyles.projectCardSimpleBackIcon} />
        </div>
        <div className={projectStyles.projectCardSimpleFront}>
          <div className={projectStyles.projectCardSimpleNewLabel}>New</div>
          <div className={projectStyles.projectCardSimpleIcon}>
            <ProjectIcon slug={projectToShow.slug} />
          </div>
          <div className={projectStyles.projectCardSimpleName}>{projectToShow.name}</div>
          <div className={projectStyles.projectCardSimpleDescription}>{projectToShow.description}</div>
        </div>
      </div>
      <div className={styles.premiumInfoBox}>
        <p>
          <span className="font-semibold">Exclusively for Premium members.</span> <a href="#">Upgrade your account</a>{" "}
          to access all the Projects as you unlock them.
        </p>
      </div>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onGoToDashboard} className={styles.btnPrimary}>
          Continue
        </button>
      </div>
    </>
  );
}
