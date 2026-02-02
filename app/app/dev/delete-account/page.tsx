"use client";

import { useState } from "react";
import { DeletingState, DeletedState, ErrorState } from "@/components/delete-account";
import styles from "./page.module.css";

type State = "deleting" | "deleted" | "error";

const states: { id: State; label: string }[] = [
  { id: "deleting", label: "1. Deleting" },
  { id: "deleted", label: "2. Deleted" },
  { id: "error", label: "3. Error" }
];

export default function DeleteAccountDevPage() {
  const [currentState, setCurrentState] = useState<State>("deleting");

  return (
    <>
      {currentState === "deleting" && <DeletingState />}
      {currentState === "deleted" && <DeletedState />}
      {currentState === "error" && <ErrorState />}

      <nav className={styles.stateNav}>
        <div className={styles.stateNavTitle}>States</div>
        {states.map((state) => (
          <button
            key={state.id}
            className={currentState === state.id ? styles.buttonActive : styles.button}
            onClick={() => setCurrentState(state.id)}
          >
            {state.label}
          </button>
        ))}
      </nav>
    </>
  );
}
