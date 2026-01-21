"use client";

import { ProjectIcon } from "@/components/icons/ProjectIcon";
import styles from "@/app/styles/components/modals.module.css";
import projectStyles from "@/app/styles/components/project-card.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

interface ProjectUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  unlockedProject: {
    name: string;
    description: string;
    slug: string;
  };
  onGoToProject: () => void;
  onGoToDashboard: () => void;
}

export function ProjectUnlockedStep({
  completionResponse,
  unlockedProject,
  onGoToProject,
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

  return (
    <>
      <h2 className={styles.modalTitle}>Project unlocked!</h2>
      <p className={styles.modalMessage}>All that practice means you&apos;re ready for a new project.</p>
      <div className={projectStyles.projectCardSimple}>
        <div className={projectStyles.projectCardSimpleBackground}></div>
        <div className={projectStyles.projectCardSimpleBack}></div>
        <div className={projectStyles.projectCardSimpleFront}>
          <div className={projectStyles.projectCardSimpleNewLabel}>New</div>
          <div className={projectStyles.projectCardSimpleIcon}>
            <ProjectIcon slug={projectToShow.slug} />
          </div>
          <div className={projectStyles.projectCardSimpleName}>{projectToShow.name}</div>
          <div className={projectStyles.projectCardSimpleDescription}>{projectToShow.description}</div>
        </div>
      </div>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onGoToProject} className={styles.btnSecondary}>
          Go to Project
        </button>
        <button onClick={onGoToDashboard} className={styles.btnPrimary}>
          Go to Dashboard
        </button>
      </div>
    </>
  );
}
