"use client";

import { showCodeSyncChoice } from "@/lib/modal/app";
import styles from "./page.module.css";

const LOCAL_CODE = ["move();", "move();", "turnLeft();", "move();", "move();", "turnLeft();", "move();"].join("\n");

const SERVER_CODE = [
  "move()",
  "move()",
  "turnLeft()",
  "move()",
  "move()",
  "turnLeft()",
  "move()",
  "turnRight()",
  "move()"
].join("\n");

const SMALL_LOCAL = ["move()", "turnLeft()", "move()"].join("\n");
const SMALL_SERVER = ["move()", "turnRight()", "move()", "move()"].join("\n");

export default function CodeSyncChoiceDevPage() {
  const trigger = (localCode: string, serverCode: string) => {
    showCodeSyncChoice({
      localCode,
      serverCode,
      onChoose: (choice) => console.debug("Chose:", choice)
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Code Sync Choice Modal</h1>
      <p className={styles.subtitle}>Isolated dev page for the local-vs-server code choice modal.</p>

      <div className={styles.list}>
        <button onClick={() => trigger(LOCAL_CODE, SERVER_CODE)} className={styles.triggerButton}>
          Every line differs (semicolons)
        </button>
        <button onClick={() => trigger(SMALL_LOCAL, SMALL_SERVER)} className={styles.triggerButton}>
          Small change
        </button>
      </div>
    </div>
  );
}
