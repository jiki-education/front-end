"use client";

import { useTranslations } from "next-intl";
import type { Task, TaskProgress } from "@jiki/curriculum";
import { assembleClassNames } from "@/lib/assemble-classnames";
import type { Orchestrator } from "../lib/Orchestrator";
import { useOrchestratorStore } from "../lib/orchestrator/store";
import styles from "./TasksView.module.css";

interface TasksViewProps {
  tasks: readonly Task[] | undefined;
  orchestrator: Orchestrator;
  className?: string;
}

export default function TasksView({ tasks, orchestrator, className = "" }: TasksViewProps) {
  const t = useTranslations("codingExercise.tasksView");
  const { taskProgress, completedTasks, currentTaskId } = useOrchestratorStore(orchestrator);
  if (!tasks || tasks.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <p className={styles.emptyText}>{t("empty")}</p>
      </div>
    );
  }

  const handleTaskClick = (taskId: string) => {
    orchestrator.setCurrentTask(taskId);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <ul className={styles.taskList}>
        {tasks.map((task, index) => {
          const progress = taskProgress.get(task.id);
          const isCompleted = completedTasks.has(task.id);
          const isCurrent = currentTaskId === task.id;
          const status = progress?.status || "not-started";

          return (
            <li key={task.id} className={styles.taskItem}>
              <TaskStatusIndicator
                index={index}
                status={status}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                progress={progress}
              />
              <div
                className={assembleClassNames(styles.taskBody, isCurrent ? styles.taskBodyCurrent : "")}
                onClick={() => handleTaskClick(task.id)}
              >
                <div className={styles.taskHeader}>
                  <p
                    className={assembleClassNames(
                      styles.taskName,
                      isCompleted ? styles.taskNameCompleted : status === "in-progress" ? styles.taskNameInProgress : ""
                    )}
                  >
                    {task.name}
                    {task.bonus && <span className={styles.bonusTag}>{t("bonus")}</span>}
                  </p>
                  {progress && progress.totalScenarios > 0 && (
                    <span className={styles.scenarioCount}>
                      {progress.passedScenarios.length}/{progress.totalScenarios}
                    </span>
                  )}
                </div>
                {task.description && <p className={styles.taskDescription}>{task.description}</p>}
                {progress && status === "in-progress" && (
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressBar}
                        style={{
                          width: `${progress.totalScenarios > 0 ? (progress.passedScenarios.length / progress.totalScenarios) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface TaskStatusIndicatorProps {
  index: number;
  status: "not-started" | "in-progress" | "completed";
  isCompleted: boolean;
  isCurrent: boolean;
  progress?: TaskProgress | null;
}

function TaskStatusIndicator({ index, status, isCompleted, isCurrent }: TaskStatusIndicatorProps) {
  if (isCompleted) {
    return <span className={assembleClassNames(styles.statusIndicator, styles.statusCompleted)}>✓</span>;
  }

  if (status === "in-progress") {
    return (
      <span
        className={assembleClassNames(
          styles.statusIndicator,
          styles.statusInProgress,
          isCurrent ? styles.ringCurrentBlue : ""
        )}
      >
        {index + 1}
      </span>
    );
  }

  // not-started
  return (
    <span
      className={assembleClassNames(
        styles.statusIndicator,
        styles.statusNotStarted,
        isCurrent ? styles.ringCurrentGray : ""
      )}
    >
      {index + 1}
    </span>
  );
}
