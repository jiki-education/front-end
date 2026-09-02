"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";
import { SITE_URL } from "@/lib/site";
import { SidebarSection } from "@/components/ui/SidebarSection/SidebarSection";
import BlueskyIcon from "@/icons/social/bluesky.svg";
import CopiedIcon from "@/icons/social/copied.svg";
import CopyLinkIcon from "@/icons/social/copy-link.svg";
import HackerNewsIcon from "@/icons/social/hacker-news.svg";
import LinkedInIcon from "@/icons/social/linkedin.svg";
import RedditIcon from "@/icons/social/reddit.svg";
import XIcon from "@/icons/social/x.svg";
import styles from "./ShareLinks.module.css";

/**
 * What is being shared. Each kind has its own sentence rather than one sentence
 * with the noun interpolated: a language that inflects the noun after "this"
 * can't be translated correctly from a fragment it never sees in place.
 */
export type ShareSubject = "blogPost" | "article" | "concept";

interface ShareLinksProps {
  /** Title of the thing being shared, used as the pre-filled post text. */
  title: string;
  /** Which sentence to show under the heading. */
  subject: ShareSubject;
  /**
   * Locale-aware path of the page (e.g. "/hu/blog/translatathon"), as built by
   * `localePath`. Shared URLs carry the locale so the reader lands in the
   * language the sharer read, and so preview scrapers — which send no
   * Accept-Language and would otherwise fall back to English — index it there.
   */
  path: string;
}

export function ShareLinks({ title, subject, path }: ShareLinksProps) {
  const t = useTranslations("common.shareLinks");
  const url = `${SITE_URL}${path}`;

  return (
    <SidebarSection heading={t("heading")} description={t(`description.${subject}`)}>
      <div className={styles.links}>
        {shareTargets(url, title).map((target) => (
          <a
            key={target.key}
            href={target.href}
            className={styles.link}
            data-network={target.key}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("shareOn", { network: target.name })}
            title={t("shareOn", { network: target.name })}
          >
            <target.Icon className={styles.icon} aria-hidden="true" focusable="false" />
          </a>
        ))}
        <CopyLinkButton url={url} />
      </div>
    </SidebarSection>
  );
}

function CopyLinkButton({ url }: { url: string }) {
  const t = useTranslations("common.shareLinks");
  const [justCopied, setJustCopied] = useState(false);

  // Revert the tick to the link glyph, so the button doesn't read as
  // permanently "done" for the rest of the visit.
  useEffect(() => {
    if (!justCopied) {
      return;
    }
    const timer = setTimeout(() => setJustCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [justCopied]);

  const handleClick = () => {
    copyToClipboard(url)
      .then(() => setJustCopied(true))
      .catch((error: unknown) => {
        console.error("Copy link failed:", error);
      });
  };

  const label = justCopied ? t("copied") : t("copyLink");
  const Icon = justCopied ? CopiedIcon : CopyLinkIcon;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.link} ${justCopied ? styles.copied : ""}`}
      aria-label={label}
      title={label}
    >
      <Icon className={styles.icon} aria-hidden="true" focusable="false" />
    </button>
  );
}

interface ShareTarget {
  key: string;
  /** Untranslated: these are product names, the same in every language. */
  name: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Every network here takes a plain GET URL with the link and text as query
 * parameters, so sharing needs no SDK, no script tag and no third-party
 * request on page load.
 */
function shareTargets(url: string, title: string): ShareTarget[] {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      key: "x",
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      Icon: XIcon
    },
    {
      key: "bluesky",
      name: "Bluesky",
      // Bluesky has no separate url parameter: the post is one text field.
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`,
      Icon: BlueskyIcon
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      // LinkedIn ignores any supplied text and reads the title from the page's
      // own OpenGraph tags, so only the URL is worth sending.
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedInIcon
    },
    {
      key: "reddit",
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      Icon: RedditIcon
    },
    {
      key: "hacker-news",
      name: "Hacker News",
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      Icon: HackerNewsIcon
    }
  ];
}
