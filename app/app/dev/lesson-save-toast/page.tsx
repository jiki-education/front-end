"use client";

import { showLessonSaveErrorToast } from "@/lib/toasts/lessonSaveError";
import styles from "./page.module.css";

export default function LessonSaveToastPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Lesson Save Error Toast</h1>
        <p className={styles.description}>
          Preview of the toast shown when a lesson&rsquo;s progress fails to save (e.g. a 422 from the
          <code className={styles.inlineCode}>/complete</code> endpoint).
        </p>
        <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-red" onClick={() => showLessonSaveErrorToast()}>
          Show toast
        </button>
      </div>
    </div>
  );
}
