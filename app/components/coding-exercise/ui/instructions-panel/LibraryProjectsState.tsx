import { LibraryWrapper } from "./LibrarySection";
import { OpenConceptLibraryButton } from "./LibraryWithConcepts";
import styles from "./instructions-panel.module.css";

export default function LibraryProjectsState() {
  return (
    <LibraryWrapper>
      <div className={styles.libraryPlaceholderBox}>
        You can use any concepts you&apos;ve learnt so far in this exercise. Refer back to your Concept Library when you
        want to remind yourself of what you&apos;ve learnt.
      </div>
      <OpenConceptLibraryButton />
    </LibraryWrapper>
  );
}
