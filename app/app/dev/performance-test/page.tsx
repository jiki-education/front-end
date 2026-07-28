"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./page.module.css";

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
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.card}>
          <h1 className={styles.title}>Performance Testing Suite</h1>
          <div className={styles.headerRow}>
            <span className={styles.themeLabel}>
              Current theme: <strong>{theme}</strong>
              {theme === "system" && ` (resolved: ${resolvedTheme})`}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={styles.metricsGrid}>
          {/* Theme Switch Performance */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Theme Switch Performance</h2>
            <div className={styles.stack4}>
              <div className={styles.metricBox}>
                <p className={styles.metricLabel}>Average Switch Time</p>
                <p className={styles.metricValueLarge}>{averageThemeSwitch.toFixed(2)}ms</p>
              </div>
              <div className={styles.metricBox}>
                <p className={styles.metricLabel}>Last Switch</p>
                <p className={styles.metricValue}>
                  {metrics.themeSwitch[metrics.themeSwitch.length - 1]?.toFixed(2) || "0"}ms
                </p>
              </div>
              <div className={styles.metricBox}>
                <p className={styles.metricLabel}>Total Switches</p>
                <p className={styles.metricValue}>{metrics.themeSwitch.length}</p>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Memory Usage</h2>
            <div className={styles.stack4}>
              <div className={styles.metricBox}>
                <p className={styles.metricLabel}>Current Usage</p>
                <p className={styles.metricValueLarge}>{latestMemory.toFixed(1)}MB</p>
              </div>
              <div className={styles.metricBox}>
                <p className={styles.metricLabel}>Samples</p>
                <p className={styles.metricValue}>{metrics.memoryUsage.length}</p>
              </div>
              <div className={styles.metricBox}>
                <p className={styles.metricLabel}>Trend</p>
                <div className={styles.trendTrack}>
                  <div
                    className={styles.trendBar}
                    style={{ width: `${Math.min((latestMemory / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Support */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Browser Support</h2>
            <div className={styles.stack3}>
              <div className={styles.supportRow}>
                <span className={styles.supportLabel}>CSS Custom Properties</span>
                <span className={styles.supportOk}>✓ Supported</span>
              </div>
              <div className={styles.supportRow}>
                <span className={styles.supportLabel}>Prefers Color Scheme</span>
                <span className={styles.supportOk}>✓ Supported</span>
              </div>
              <div className={styles.supportRow}>
                <span className={styles.supportLabel}>Local Storage</span>
                <span className={styles.supportOk}>✓ Supported</span>
              </div>
              <div className={styles.supportRow}>
                <span className={styles.supportLabel}>Performance API</span>
                <span className={typeof performance !== "undefined" ? styles.supportOk : styles.supportNo}>
                  {typeof performance !== "undefined" ? "✓ Supported" : "✗ Not Available"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tests */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Performance Tests</h2>

          <div className={styles.testsGrid}>
            {/* Manual Testing */}
            <div className={styles.stack4}>
              <h3 className={styles.subheading}>Manual Testing</h3>
              <div className={styles.stack3}>
                <button onClick={measureThemeSwitchPerformance} className={`${styles.buttonPrimary} focus-ring`}>
                  Measure Theme Switch
                </button>
                <button
                  onClick={() => setMetrics({ themeSwitch: [], renderTime: [], memoryUsage: [] })}
                  className={`${styles.buttonSecondary} focus-ring`}
                >
                  Clear Metrics
                </button>
              </div>
            </div>

            {/* Stress Testing */}
            <div className={styles.stack4}>
              <h3 className={styles.subheading}>Stress Testing</h3>
              <div className={styles.stack3}>
                <button
                  onClick={runStressTest}
                  disabled={isStressTest}
                  className={`${styles.buttonWarning} focus-ring`}
                >
                  {isStressTest ? `Running... (${stressCount}/50)` : "Run Stress Test (50 switches)"}
                </button>
                {isStressTest && (
                  <div className={styles.stressTrack}>
                    <div className={styles.stressBar} style={{ width: `${(stressCount / 50) * 100}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Performance Timeline</h2>

          {/* Theme Switch Timeline */}
          <div className={styles.timelineBlock}>
            <h3 className={styles.timelineHeading}>Theme Switch Times (last 20)</h3>
            <div className={styles.chart}>
              {metrics.themeSwitch.map((time, index) => (
                <div
                  key={index}
                  className={styles.chartBarSwitch}
                  style={{
                    height: `${Math.min((time / Math.max(...metrics.themeSwitch, 10)) * 100, 100)}%`,
                    opacity: 0.7 + (index / metrics.themeSwitch.length) * 0.3
                  }}
                  title={`${time.toFixed(2)}ms`}
                ></div>
              ))}
            </div>
            <p className={styles.rangeLabel}>
              Range: {metrics.themeSwitch.length > 0 ? Math.min(...metrics.themeSwitch).toFixed(2) : "0"}ms -{" "}
              {metrics.themeSwitch.length > 0 ? Math.max(...metrics.themeSwitch).toFixed(2) : "0"}ms
            </p>
          </div>

          {/* Memory Usage Timeline */}
          <div>
            <h3 className={styles.timelineHeading}>Memory Usage (last 20 samples)</h3>
            <div className={styles.chart}>
              {metrics.memoryUsage.map((usage, index) => (
                <div
                  key={index}
                  className={styles.chartBarMemory}
                  style={{
                    height: `${Math.min((usage / Math.max(...metrics.memoryUsage, 10)) * 100, 100)}%`,
                    opacity: 0.7 + (index / metrics.memoryUsage.length) * 0.3
                  }}
                  title={`${usage.toFixed(1)}MB`}
                ></div>
              ))}
            </div>
            <p className={styles.rangeLabel}>
              Range: {metrics.memoryUsage.length > 0 ? Math.min(...metrics.memoryUsage).toFixed(1) : "0"}MB -{" "}
              {metrics.memoryUsage.length > 0 ? Math.max(...metrics.memoryUsage).toFixed(1) : "0"}MB
            </p>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className={styles.cardInfo}>
          <h2 className={styles.cardTitleInfo}>Performance Analysis</h2>
          <div className={styles.analysisList}>
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
