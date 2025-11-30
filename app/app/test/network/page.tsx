"use client";

import { fetchLevels } from "@/lib/api/levels";
import { fetchConcepts } from "@/lib/api/concepts";
import { useState } from "react";
import type { Level } from "@/types/levels";
import type { ConceptListItem } from "@/types/concepts";

export default function NetworkTestPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [concepts, setConcepts] = useState<ConceptListItem[]>([]);
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
      const [levelsData, conceptsData] = await Promise.all([fetchLevels(), fetchConcepts()]);
      setLevels(levelsData);
      setConcepts(conceptsData.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoadingMultiple(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-text-primary">Network Error Test Page</h1>

        <div className="space-y-4">
          <button
            onClick={handleLoadLevels}
            disabled={loading}
            className="px-6 py-3 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring disabled:opacity-50"
            data-testid="load-levels-button"
          >
            {loading ? "Loading..." : "Load Levels (Single API Call)"}
          </button>

          <button
            onClick={handleLoadMultiple}
            disabled={loadingMultiple}
            className="px-6 py-3 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring disabled:opacity-50"
            data-testid="load-multiple-button"
          >
            {loadingMultiple ? "Loading..." : "Load Multiple (2 API Calls)"}
          </button>

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded" data-testid="error-message">
              Error: {error}
            </div>
          )}

          {levels.length > 0 && (
            <div className="p-4 bg-green-100 text-green-800 rounded" data-testid="success-message">
              Successfully loaded {levels.length} levels
              {concepts.length > 0 && ` and ${concepts.length} concepts`}
            </div>
          )}

          <div className="mt-8 p-4 bg-bg-secondary rounded">
            <h2 className="font-bold mb-2">Test Instructions:</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm">
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
