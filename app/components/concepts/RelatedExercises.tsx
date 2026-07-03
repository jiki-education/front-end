import Link from "next/link";
import type { LessonStatus } from "@/lib/api/lesson-progress";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { LessonIcon } from "@/components/icons/LessonIcon";
import styles from "./RelatedExercises.module.css";

interface ExerciseItem {
  slug: string;
  title: string;
}

interface RelatedExercisesProps {
  exercises: ExerciseItem[];
  getStatus: (slug: string) => LessonStatus;
  isAuthenticated: boolean;
}

export function RelatedExercises({ exercises, getStatus, isAuthenticated }: RelatedExercisesProps) {
  const routes = useLocaleRoutes();
  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>Related Exercises</h3>
      <p className={styles.description}>These exercises are great ways for you to practice this concept!</p>
      {!isAuthenticated && (
        <p className={styles.signupPrompt}>
          <Link href={routes.authSignup()} className={styles.signupLink}>
            Sign up
          </Link>{" "}
          to solve them!
        </p>
      )}
      <div className={styles.list}>
        {exercises.map((ex) => (
          <ExerciseItem key={ex.slug} exercise={ex} status={getStatus(ex.slug)} />
        ))}
      </div>
    </div>
  );
}

function ExerciseItem({ exercise, status }: { exercise: ExerciseItem; status: LessonStatus }) {
  const stateClass = statusToClass(status);
  const className = `${styles.item} ${stateClass}`;

  if (status === "locked") {
    return (
      <span className={className} title="This exercise is locked">
        <LessonIcon slug={exercise.slug} width={48} height={48} />
        <span className={styles.itemName}>{exercise.title}</span>
      </span>
    );
  }

  return (
    <Link href={`/lesson/${exercise.slug}`} className={className}>
      <LessonIcon slug={exercise.slug} width={48} height={48} />
      <span className={styles.itemName}>{exercise.title}</span>
    </Link>
  );
}

function statusToClass(status: LessonStatus): string {
  switch (status) {
    case "completed":
      return styles.completed;
    case "started":
      return styles.inProgress;
    case "not_started":
      return styles.available;
    case "locked":
      return styles.locked;
    default:
      status satisfies never;
      return styles.available;
  }
}
