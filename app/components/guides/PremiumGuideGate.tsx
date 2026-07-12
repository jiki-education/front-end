"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import MarkdownContent from "@/components/content/MarkdownContent";
import LockIcon from "@/icons/lock.svg";
import styles from "./PremiumGuideGate.module.css";

interface PremiumGuideGateProps {
  slug: string;
  content: string;
}

/**
 * Return the first paragraph of a rendered HTML body (everything up to and
 * including the first closing </p>). Used as the teaser shown to non-premium
 * viewers of a premium guide. Falls back to the whole body if no paragraph is found.
 */
function firstParagraph(html: string): string {
  const end = html.indexOf("</p>");
  if (end === -1) {
    return html;
  }
  return html.slice(0, end + "</p>".length);
}

export default function PremiumGuideGate({ slug, content }: PremiumGuideGateProps) {
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  // Logged-in viewers read at app scale; logged-out visitors get the larger
  // marketing-page type (matching the hero header split).
  const variant = user ? "base" : "large";

  // Premium members (and only them) get the full guide. Everyone else sees a
  // teaser followed by an upgrade CTA. The pre-hydration/server render matches
  // the logged-out state, so there is no hydration mismatch.
  if (userIsPremium) {
    return <MarkdownContent content={content} variant={variant} />;
  }

  return (
    <>
      <MarkdownContent content={firstParagraph(content)} variant={variant} />
      <div className={styles.lockedCta}>
        <div className={styles.lockedIcon}>
          <LockIcon />
        </div>
        <h2 className={styles.lockedTitle}>This guide is for Premium members</h2>
        <p className={styles.lockedSubtitle}>
          Unlock this guide, and everything else Jiki Premium has to offer, to keep reading.
        </p>
        <button
          type="button"
          className={styles.lockedButton}
          onClick={() => showPremiumUpgradeModal("locked_guide", { contextType: "guide", contextSlug: slug })}
        >
          Unlock with Premium
        </button>
      </div>
    </>
  );
}
