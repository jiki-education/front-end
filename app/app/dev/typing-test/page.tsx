import TypingTestPanel from "@/components/coding-exercise/ui/TypingTestPanel";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dev: Typing Test - Jiki",
  description: "Development page for testing TypeIt.js typing animations."
};

export default function TypingTestPage() {
  return (
    <div className={styles.page}>
      <TypingTestPanel />
    </div>
  );
}
