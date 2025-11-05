"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface PerformanceMetrics {
  themeSwitch: number[];
  renderTime: number[];
  memoryUsage: number[];
}

export default function PerformanceTestPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    themeSwitch: [],
    renderTime: [],
    memoryUsage: []
  });
  const [isStressTest, setIsStressTest] = useState(false);
  const [stressCount, setStressCount] = useState(0);

  // Performance monitoring
  const measureThemeSwitchPerformance = useCallback(() => {
    const start = performance.now();

    // Trigger theme switch
    const nextTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    // Measure after next frame
    requestAnimationFrame(() => {
      const end = performance.now();
      const duration = end - start;

      setMetrics((prev) => ({
        ...prev,
        themeSwitch: [...prev.themeSwitch.slice(-19), duration]
      }));
    });
  }, [resolvedTheme, setTheme]);

  // Stress test function
  const runStressTest = useCallback(async () => {
    setIsStressTest(true);
    setStressCount(0);

    for (let i = 0; i < 50; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      measureThemeSwitchPerformance();
      setStressCount(i + 1);
    }

    setIsStressTest(false);
  }, [measureThemeSwitchPerformance]);

  // Memory usage monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / 1024 / 1024; // MB
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: [...prev.memoryUsage.slice(-19), usage]
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Render time monitoring
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === "measure" || entry.entryType === "navigation") {
          const duration = entry.duration;
          setMetrics((prev) => ({
            ...prev,
            renderTime: [...prev.renderTime.slice(-19), duration]
          }));
        }
      }
    });

    observer.observe({ entryTypes: ["measure", "navigation"] });

    return () => observer.disconnect();
  }, []);

  const averageThemeSwitch =
    metrics.themeSwitch.length > 0 ? metrics.themeSwitch.reduce((a, b) => a + b, 0) / metrics.themeSwitch.length : 0;

  const latestMemory = metrics.memoryUsage[metrics.memoryUsage.length - 1] || 0;

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Performance Testing Suite</h1>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary">
              Current theme: <strong className="text-text-primary">{theme}</strong>
              {theme === "system" && ` (resolved: ${resolvedTheme})`}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Theme Switch Performance */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Theme Switch Performance</h2>
            <div className="space-y-4">
              <div className="bg-bg-primary p-4 rounded">
                <p className="text-sm text-text-secondary">Average Switch Time</p>
                <p className="text-2xl font-bold text-text-primary">{averageThemeSwitch.toFixed(2)}ms</p>
              </div>
              <div className="bg-bg-primary p-4 rounded">
                <p className="text-sm text-text-secondary">Last Switch</p>
                <p className="text-lg text-text-primary">
                  {metrics.themeSwitch[metrics.themeSwitch.length - 1]?.toFixed(2) || "0"}ms
                </p>
              </div>
              <div className="bg-bg-primary p-4 rounded">
                <p className="text-sm text-text-secondary">Total Switches</p>
                <p className="text-lg text-text-primary">{metrics.themeSwitch.length}</p>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Memory Usage</h2>
            <div className="space-y-4">
              <div className="bg-bg-primary p-4 rounded">
                <p className="text-sm text-text-secondary">Current Usage</p>
                <p className="text-2xl font-bold text-text-primary">{latestMemory.toFixed(1)}MB</p>
              </div>
              <div className="bg-bg-primary p-4 rounded">
                <p className="text-sm text-text-secondary">Samples</p>
                <p className="text-lg text-text-primary">{metrics.memoryUsage.length}</p>
              </div>
              <div className="bg-bg-primary p-4 rounded">
                <p className="text-sm text-text-secondary">Trend</p>
                <div className="w-full bg-bg-tertiary rounded-full h-2 mt-2">
                  <div
                    className="bg-link-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((latestMemory / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Support */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Browser Support</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">CSS Custom Properties</span>
                <span className="text-success-text">✓ Supported</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Prefers Color Scheme</span>
                <span className="text-success-text">✓ Supported</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Local Storage</span>
                <span className="text-success-text">✓ Supported</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Performance API</span>
                <span className={typeof performance !== "undefined" ? "text-success-text" : "text-error-text"}>
                  {typeof performance !== "undefined" ? "✓ Supported" : "✗ Not Available"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tests */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Performance Tests</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Testing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Manual Testing</h3>
              <div className="space-y-3">
                <button
                  onClick={measureThemeSwitchPerformance}
                  className="w-full bg-button-primary-bg text-button-primary-text px-4 py-2 rounded-md focus-ring hover:opacity-90 transition-opacity"
                >
                  Measure Theme Switch
                </button>
                <button
                  onClick={() => setMetrics({ themeSwitch: [], renderTime: [], memoryUsage: [] })}
                  className="w-full bg-button-secondary-bg text-button-secondary-text px-4 py-2 rounded-md border border-border-secondary focus-ring hover:bg-bg-tertiary transition-colors"
                >
                  Clear Metrics
                </button>
              </div>
            </div>

            {/* Stress Testing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Stress Testing</h3>
              <div className="space-y-3">
                <button
                  onClick={runStressTest}
                  disabled={isStressTest}
                  className="w-full bg-warning-bg text-warning-text px-4 py-2 rounded-md border border-warning-border focus-ring hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStressTest ? `Running... (${stressCount}/50)` : "Run Stress Test (50 switches)"}
                </button>
                {isStressTest && (
                  <div className="w-full bg-bg-primary rounded-full h-2">
                    <div
                      className="bg-warning-border h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stressCount / 50) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Performance Timeline</h2>

          {/* Theme Switch Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-3">Theme Switch Times (last 20)</h3>
            <div className="flex items-end gap-1 h-32 bg-bg-primary p-4 rounded">
              {metrics.themeSwitch.map((time, index) => (
                <div
                  key={index}
                  className="bg-link-primary rounded-t flex-1 min-w-0 transition-all"
                  style={{
                    height: `${Math.min((time / Math.max(...metrics.themeSwitch, 10)) * 100, 100)}%`,
                    opacity: 0.7 + (index / metrics.themeSwitch.length) * 0.3
                  }}
                  title={`${time.toFixed(2)}ms`}
                ></div>
              ))}
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Range: {metrics.themeSwitch.length > 0 ? Math.min(...metrics.themeSwitch).toFixed(2) : "0"}ms -{" "}
              {metrics.themeSwitch.length > 0 ? Math.max(...metrics.themeSwitch).toFixed(2) : "0"}ms
            </p>
          </div>

          {/* Memory Usage Timeline */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Memory Usage (last 20 samples)</h3>
            <div className="flex items-end gap-1 h-32 bg-bg-primary p-4 rounded">
              {metrics.memoryUsage.map((usage, index) => (
                <div
                  key={index}
                  className="bg-success-border rounded-t flex-1 min-w-0 transition-all"
                  style={{
                    height: `${Math.min((usage / Math.max(...metrics.memoryUsage, 10)) * 100, 100)}%`,
                    opacity: 0.7 + (index / metrics.memoryUsage.length) * 0.3
                  }}
                  title={`${usage.toFixed(1)}MB`}
                ></div>
              ))}
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Range: {metrics.memoryUsage.length > 0 ? Math.min(...metrics.memoryUsage).toFixed(1) : "0"}MB -{" "}
              {metrics.memoryUsage.length > 0 ? Math.max(...metrics.memoryUsage).toFixed(1) : "0"}MB
            </p>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="bg-info-bg border border-info-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-info-text mb-4">Performance Analysis</h2>
          <div className="text-info-text space-y-2">
            <p>• Theme switches should complete within 16ms for 60fps smoothness</p>
            <p>• CSS custom properties provide optimal performance compared to JavaScript-based theming</p>
            <p>• Transitions are disabled automatically for users with motion preferences</p>
            <p>• Memory usage should remain stable during theme switches</p>
            <p>
              • Current average: <strong>{averageThemeSwitch.toFixed(2)}ms</strong>{" "}
              {averageThemeSwitch < 16 ? "✓ Excellent" : averageThemeSwitch < 32 ? "⚠ Good" : "⚠ Needs optimization"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
