"use client";

import { fetchLevels } from "@/lib/api/levels";
import { getConcepts } from "@/lib/api/concepts";
import { useState } from "react";
import type { Level } from "@/types/levels";
import type { ConceptMeta } from "@/types/concepts";
import styles from "./page.module.css";

export default function NetworkTestPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [concepts, setConcepts] = useState<ConceptMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMultiple, setLoadingMultiple] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadLevels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLevels();
      setLevels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load levels");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMultiple = async () => {
    setLoadingMultiple(true);
    setError(null);
    setLevels([]);
    setConcepts([]);
    try {
      const [levelsData, conceptsData] = await Promise.all([fetchLevels(), getConcepts()]);
      setLevels(levelsData);
      setConcepts(conceptsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoadingMultiple(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Network Error Test Page</h1>

        <div className={styles.stack}>
          <button
            onClick={handleLoadLevels}
            disabled={loading}
            className={`${styles.primaryButton} focus-ring`}
            data-testid="load-levels-button"
          >
            {loading ? "Loading..." : "Load Levels (Single API Call)"}
          </button>

          <button
            onClick={handleLoadMultiple}
            disabled={loadingMultiple}
            className={`${styles.primaryButton} focus-ring`}
            data-testid="load-multiple-button"
          >
            {loadingMultiple ? "Loading..." : "Load Multiple (2 API Calls)"}
          </button>

          {error && (
            <div className={styles.errorMessage} data-testid="error-message">
              Error: {error}
            </div>
          )}

          {levels.length > 0 && (
            <div className={styles.successMessage} data-testid="success-message">
              Successfully loaded {levels.length} levels
              {concepts.length > 0 && ` and ${concepts.length} concepts`}
            </div>
          )}

          <div className={styles.instructions}>
            <h2 className={styles.instructionsTitle}>Test Instructions:</h2>
            <ol className={styles.instructionsList}>
              <li>Click &quot;Load Levels&quot; button to trigger API call</li>
              <li>Network errors will show modal via GlobalErrorHandler</li>
              <li>Modal should appear after ~1s of failed retries</li>
              <li>Restoring network should auto-close modal and succeed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
