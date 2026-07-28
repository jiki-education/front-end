"use client";

import { useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./page.module.css";

export default function AccessibilityTestPage() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.card}>
          <h1 className={styles.title}>Accessibility Test Suite</h1>
          <div className={styles.headerRow}>
            <span className={styles.themeLabel}>
              Current theme: <strong>{theme}</strong>
              {theme === "system" && ` (resolved: ${resolvedTheme})`}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Contrast Ratio Testing */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Contrast Ratio Testing</h2>
          <div className={styles.grid2}>
            {/* Text Contrast */}
            <div className={styles.column}>
              <h3 className={styles.subheading}>Text Contrast</h3>
              <div className={styles.stack2}>
                <div className={styles.swatch}>
                  <p className={styles.textPrimary}>Primary text (AAA)</p>
                </div>
                <div className={styles.swatch}>
                  <p className={styles.textSecondary}>Secondary text (AA)</p>
                </div>
                <div className={styles.swatch}>
                  <p className={styles.textTertiary}>Tertiary text (AA)</p>
                </div>
                <div className={styles.swatch}>
                  <p className={styles.textMuted}>Muted text (AA Large)</p>
                </div>
              </div>
            </div>

            {/* Link Contrast */}
            <div className={styles.column}>
              <h3 className={styles.subheading}>Link Contrast</h3>
              <div className={styles.stack2}>
                <div className={styles.swatch}>
                  <a href="#" className={`${styles.link} focus-ring`}>
                    Primary link
                  </a>
                </div>
                <div className={styles.swatch}>
                  <a href="#" className={`${styles.link} ${styles.linkUnderline} focus-ring`}>
                    Underlined link
                  </a>
                </div>
                <div className={styles.swatchSecondary}>
                  <a href="#" className={`${styles.link} focus-ring`}>
                    Link on secondary background
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus States Testing */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Focus States</h2>
          <div className={styles.grid2}>
            {/* Buttons */}
            <div className={styles.column}>
              <h3 className={styles.subheading}>Interactive Elements</h3>
              <div className={styles.stack3}>
                <button className={`${styles.buttonPrimary} focus-ring`}>Primary Button</button>
                <button className={`${styles.buttonSecondary} focus-ring`}>Secondary Button</button>
                <button className={`${styles.buttonOutline} focus-ring`}>Outline Button</button>
              </div>
            </div>

            {/* Form Elements */}
            <div className={styles.column}>
              <h3 className={styles.subheading}>Form Elements</h3>
              <div className={styles.stack3}>
                <input type="text" placeholder="Text input" className={`${styles.input} focus-ring`} />
                <select className={`${styles.input} focus-ring`}>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea placeholder="Textarea" rows={3} className={`${styles.textarea} focus-ring`} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Colors Testing */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Status Colors Accessibility</h2>
          <div className={styles.grid4}>
            <div className={`${styles.statusCard} ${styles.statusSuccess}`}>
              <h4 className={styles.statusHeadingSuccess}>Success</h4>
              <p className={styles.statusTextSuccess}>Action completed successfully</p>
            </div>

            <div className={`${styles.statusCard} ${styles.statusError}`}>
              <h4 className={styles.statusHeadingError}>Error</h4>
              <p className={styles.statusTextError}>Something went wrong</p>
            </div>

            <div className={`${styles.statusCard} ${styles.statusWarning}`}>
              <h4 className={styles.statusHeadingWarning}>Warning</h4>
              <p className={styles.statusTextWarning}>Please review this item</p>
            </div>

            <div className={`${styles.statusCard} ${styles.statusInfo}`}>
              <h4 className={styles.statusHeadingInfo}>Information</h4>
              <p className={styles.statusTextInfo}>Additional details available</p>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Test */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Keyboard Navigation</h2>
          <p className={styles.description}>
            Use Tab to navigate through these elements. Focus rings should be clearly visible.
          </p>
          <div className={styles.keyboardRow}>
            <button className={`${styles.keyboardButtonPrimary} focus-ring`}>Button 1</button>
            <button className={`${styles.keyboardButtonSecondary} focus-ring`}>Button 2</button>
            <a href="#" className={`${styles.keyboardLink} focus-ring`}>
              Link 1
            </a>
            <a href="#" className={`${styles.keyboardLink} focus-ring`}>
              Link 2
            </a>
            <input type="text" placeholder="Input field" className={`${styles.keyboardInput} focus-ring`} />
          </div>
        </div>

        {/* ARIA and Screen Reader Testing */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>ARIA and Screen Reader Support</h2>
          <div className={styles.column}>
            <div role="alert" aria-live="polite" className={styles.alert}>
              <h3 className={styles.alertHeading}>Error Alert</h3>
              <p className={styles.alertText}>This is an important error message for screen readers.</p>
            </div>

            <div className={styles.infoBox}>
              <h3 className={styles.infoBoxHeading}>Progress Indicator</h3>
              <div
                role="progressbar"
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Theme setup progress"
                className={styles.progressTrack}
              >
                <div className={styles.progressBar} style={{ width: "75%" }}></div>
              </div>
              <p className={styles.progressLabel}>75% complete</p>
            </div>

            <div className={styles.infoBox}>
              <h3 className={styles.infoBoxHeading}>Toggle Switch</h3>
              <label className={styles.toggleLabel}>
                <input type="checkbox" className="sr-only" />
                <div className={styles.toggleWrapper}>
                  <div className={styles.toggleTrack}></div>
                  <div className={`${styles.toggleKnob} focus-ring`}></div>
                </div>
                <span className={styles.toggleText}>Enable dark mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* High Contrast Mode Notice */}
        <div className={styles.noticeWarning}>
          <h2 className={styles.noticeTitleWarning}>High Contrast Mode Support</h2>
          <p className={styles.noticeTextWarning}>
            This theme system automatically adapts to high contrast mode preferences. Test by enabling high contrast
            mode in your operating system settings.
          </p>
        </div>

        {/* Reduced Motion Notice */}
        <div className={styles.noticeInfo}>
          <h2 className={styles.noticeTitleInfo}>Reduced Motion Support</h2>
          <p className={styles.noticeTextInfo}>
            All theme transitions respect the &ldquo;prefers-reduced-motion&rdquo; setting. Animations will be disabled
            for users who prefer reduced motion.
          </p>
        </div>
      </div>
    </div>
  );
}
