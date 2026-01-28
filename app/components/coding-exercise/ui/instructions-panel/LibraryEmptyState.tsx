import { LibraryWrapper } from "./LibrarySection";
import styles from "./instructions-panel.module.css";

export default function LibraryEmptyState() {
  return (
    <LibraryWrapper>
      <div className={styles.libraryPlaceholderBox}>
        This is where you will see Concepts as you progress through the exercises. These will be references you can use
        to refresh your memory on what you&apos;ve learnt.
      </div>
    </LibraryWrapper>
  );
}
