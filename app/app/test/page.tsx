import Link from "next/link";
import type { Metadata } from "next";
import styles from "./test-shell.module.css";

export const metadata: Metadata = {
  title: "Test Pages - Jiki",
  description: "Component test pages for development and E2E testing."
};

export default function TestIndexPage() {
  const testPages = [
    {
      category: "CodeMirror",
      pages: [
        {
          name: "Extensions",
          path: "/test/codemirror/extensions",
          description: "Test page for CodeMirror extensions"
        }
      ]
    },
    {
      category: "Coding Exercise",
      pages: [
        {
          name: "Breakpoint Gutter",
          path: "/test/coding-exercise/breakpoint-gutter",
          description: "Test breakpoint gutter functionality"
        },
        {
          name: "Breakpoint Stepper Buttons",
          path: "/test/coding-exercise/breakpoint-stepper-buttons",
          description: "Test breakpoint navigation controls"
        },
        {
          name: "Code Folding",
          path: "/test/coding-exercise/code-folding",
          description: "Test code folding functionality"
        },
        {
          name: "Frame Stepper Buttons",
          path: "/test/coding-exercise/frame-stepper-buttons",
          description: "Test frame navigation controls"
        },
        {
          name: "Orchestrator CodeMirror",
          path: "/test/coding-exercise/orchestrator-codemirror",
          description: "Test orchestrator integration with CodeMirror"
        },
        {
          name: "Scrubber Input",
          path: "/test/coding-exercise/scrubber-input",
          description: "Test timeline scrubber input control"
        }
      ]
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Test Pages</h1>
        <p className={styles.subtitle}>Component test pages for development and E2E testing</p>

        {testPages.map((category) => (
          <div key={category.category} className={styles.section}>
            <h2 className={styles.sectionTitle}>{category.category}</h2>
            <div className={styles.grid}>
              {category.pages.map((page) => (
                <Link key={page.path} href={page.path} className={styles.card}>
                  <h3 className={styles.cardTitle}>{page.name}</h3>
                  <p className={styles.cardDescription}>{page.description}</p>
                  <p className={styles.cardPath}>{page.path}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.note}>
          <p className={styles.noteText}>
            <strong>Note:</strong> These pages are for testing purposes only and are not available in production.
          </p>
        </div>
      </div>
    </div>
  );
}
