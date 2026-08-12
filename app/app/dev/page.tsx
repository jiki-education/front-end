"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function DevPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Development Tools</h1>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Environment Info</h2>
          <dl className={styles.definitionList}>
            <div>
              <dt className={styles.term}>Node Environment:</dt>
              <dd className={styles.definition}>{process.env.NODE_ENV}</dd>
            </div>
            <div>
              <dt className={styles.term}>Next.js Version:</dt>
              <dd className={styles.definition}>{process.env.NEXT_RUNTIME ? "Edge Runtime" : "Node Runtime"}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Dev Pages</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/dev/llm-chat" className={styles.link}>
                LLM Chat Proxy Test
              </Link>
              <span className={styles.linkDescription}>- Test the LLM chat proxy with SSE streaming</span>
            </li>
            <li>
              <Link href="/dev/stripe-test" className={styles.link}>
                Stripe Subscription Test
              </Link>
              <span className={styles.linkDescription}>
                - Test Stripe subscription flows, upgrades, downgrades, and customer portal43
              </span>
            </li>
            <li>
              <Link href="/dev/typing-test" className={styles.link}>
                Typing Effect Test
              </Link>
              <span className={styles.linkDescription}>- Test TypeIt.js chat typing animation without API calls</span>
            </li>
            <li>
              <Link href="/dev/ui-kit" className={styles.link}>
                UI Kit Demo
              </Link>
              <span className={styles.linkDescription}>- Simple demo of all UI kit components</span>
            </li>
            <li>
              <Link href="/dev/oauth-google" className={styles.link}>
                Google OAuth Test
              </Link>
              <span className={styles.linkDescription}>- Test Google Sign-In integration with backend</span>
            </li>
            <li>
              <Link href="/dev/subscription-modal-test" className={styles.link}>
                Subscription Modal Test
              </Link>
              <span className={styles.linkDescription}>
                - Test the new global subscription modal system with different contexts
              </span>
            </li>
            <li>
              <Link href="/dev/test-global-modals" className={styles.link}>
                Global Modal System Test
              </Link>
              <span className={styles.linkDescription}>
                - Test all global modals including subscription, confirmation, and info modals
              </span>
            </li>
            <li>
              <Link href="/dev/premium-upgrade-modal-test" className={styles.link}>
                Premium Upgrade Modal Test
              </Link>
              <span className={styles.linkDescription}>- Test the new premium upgrade modal with clean design</span>
            </li>
            <li>
              <Link href="/dev/buttons" className={styles.link}>
                Buttons
              </Link>
              <span className={styles.linkDescription}>- All ui-btn variants and styles</span>
            </li>
            <li>
              <Link href="/dev/chat-panel-states" className={styles.link}>
                Chat Panel States
              </Link>
              <span className={styles.linkDescription}>- All chat panel state components</span>
            </li>
            <li>
              <Link href="/dev/textual-content" className={styles.link}>
                Textual Content Styling
              </Link>
              <span className={styles.linkDescription}>- Typography and admonition styles for markdown content</span>
            </li>
            <li>
              <Link href="/dev/walkthrough-card" className={styles.link}>
                Walkthrough Card
              </Link>
              <span className={styles.linkDescription}>
                - All walkthrough card states (locked, unwatched, watching, watched)
              </span>
            </li>
            <li>
              <Link href="/dev/hints-walkthrough" className={styles.link}>
                Hints Walkthrough
              </Link>
              <span className={styles.linkDescription}>- HintsPanel with walkthrough video section</span>
            </li>
            <li>
              <Link href="/dev/challenges-sidebar" className={styles.link}>
                Challenges Sidebar States
              </Link>
              <span className={styles.linkDescription}>
                - All challenges sidebar states (loading, free user, premium empty, premium with challenges)
              </span>
            </li>
            <li>
              <Link href="/dev/user-profile-card" className={styles.link}>
                User Profile Card
              </Link>
              <span className={styles.linkDescription}>
                - Before/after comparison: current icon badge vs. premium star badge design
              </span>
            </li>
            <li>
              <Link href="/dev/challenge-unlocked-modal" className={styles.link}>
                Challenge Unlocked Modal
              </Link>
              <span className={styles.linkDescription}>- Isolated test page for the challenge-unlocked step</span>
            </li>
            <li>
              <Link href="/dev/curriculum-videos" className={styles.link}>
                Curriculum Videos
              </Link>
              <span className={styles.linkDescription}>
                - All videos from api&apos;s curriculum.json, grouped by level
              </span>
            </li>
            <li>
              <Link href="/dev/video-captions" className={styles.link}>
                Video Captions
              </Link>
              <span className={styles.linkDescription}>
                - Locale-based caption auto-enable, driven by the i18n repo&apos;s translated .vtt files
              </span>
            </li>
          </ul>
        </div>

        <div className={styles.note}>
          <p className={styles.noteText}>
            <strong>Note:</strong> This page is only accessible in development mode. It will return a 404 in production.
          </p>
        </div>
      </div>
    </div>
  );
}
