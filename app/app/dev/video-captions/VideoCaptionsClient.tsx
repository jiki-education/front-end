"use client";

import { useState } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import JikiVideoPlayer from "@/components/ui/JikiVideoPlayer";
import { DEFAULT_TIME_ZONE } from "@/lib/i18n/config";
import styles from "./page.module.css";

export interface CaptionVideo {
  slug: string;
  playbackId: string;
  /** Locales in the i18n repo that have a subtitles.vtt for this video. */
  locales: string[];
}

interface VideoCaptionsClientProps {
  videos: CaptionVideo[];
  i18nRepo: string;
  i18nPresent: boolean;
}

/**
 * Drives the locale-based caption auto-enable against the i18n repo's real
 * translated .vtt files.
 *
 * In production the translated tracks live on the Mux asset — the `videos` repo
 * uploads them, and the player finds them in the HLS manifest. That upload has
 * not happened yet, and the manifest currently carries English only, so this page
 * stands in for it: the .vtt is served straight off the sibling i18n checkout and
 * attached to the player as a `<track>`. Either way the player sees a text track
 * with a language, which is all the auto-enable matches on.
 *
 * The locale is overridden per player with a real NextIntlClientProvider rather
 * than a prop, so the production path runs untouched: JikiVideoPlayer reads
 * `useLocale()` exactly as it does in the app, and switching locale here is the
 * same thing as a reader whose UI is in that language loading the page.
 */
export default function VideoCaptionsClient({ videos, i18nRepo, i18nPresent }: VideoCaptionsClientProps) {
  // `videos` is empty when either repo is missing or nothing joins, so these
  // reads are guarded by the two early returns below. tsconfig has
  // noUncheckedIndexedAccess off, so TypeScript types them as non-optional and
  // cannot see that — hence the explicit checks rather than `?.`.
  const [slug, setSlug] = useState(videos.length > 0 ? videos[0].slug : "");
  const video = videos.find((entry) => entry.slug === slug) ?? (videos.length > 0 ? videos[0] : null);
  const [locale, setLocale] = useState(video && video.locales.length > 0 ? video.locales[0] : "en");

  if (!i18nPresent) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Video captions</h1>
          <p className={styles.note}>
            No i18n checkout found at <code>{i18nRepo}</code>. Clone <code>https://github.com/jiki-education/i18n</code>{" "}
            beside this repo, or set <code>JIKI_I18N_REPO</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Video captions</h1>
          <p className={styles.note}>
            No video has both a Mux playback id in the curriculum seed and a <code>subtitles.vtt</code> in the i18n
            repo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Video captions</h1>
        <p className={styles.note}>
          Captions should come on automatically, in the chosen locale, without touching the player&apos;s CC button.
          Choosing <strong>en</strong> is the control: it is the default locale, so nothing should switch on.
        </p>

        <div className={styles.controls}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Video</span>
            <select
              className={styles.select}
              value={video.slug}
              onChange={(event) => {
                const next = videos.find((entry) => entry.slug === event.target.value);
                setSlug(event.target.value);
                // Keep the locale if the new video has it; otherwise fall back to
                // one it actually has, so the player is never pointed at a 404.
                if (next && next.locales.length > 0 && !next.locales.includes(locale)) {
                  setLocale(next.locales[0]);
                }
              }}
            >
              {videos.map((entry) => (
                <option key={entry.slug} value={entry.slug}>
                  {entry.slug} ({entry.locales.length} locales)
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>UI locale</span>
            <select className={styles.select} value={locale} onChange={(event) => setLocale(event.target.value)}>
              <option value="en">en (default — control)</option>
              {video.locales.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.playerCard}>
          {/* Keyed on video+locale so a change remounts the player and re-runs the
              once-per-instance auto-enable — what makes this a rig, not a viewer. */}
          <LocalisedPlayer key={`${video.slug}:${locale}`} locale={locale} video={video} />
        </div>

        <p className={styles.note}>
          Serving <code>{`locales/${locale}/videos/${video.slug}/subtitles.vtt`}</code> from <code>{i18nRepo}</code>.
          Playback id <code>{video.playbackId}</code>.
        </p>
      </div>
    </div>
  );
}

// Renders the player under an overridden locale. Messages come from the ambient
// provider: only the locale matters here, and reusing them keeps this from
// needing a catalog fetch per locale.
function LocalisedPlayer({ locale, video }: { locale: string; video: CaptionVideo }) {
  const messages = useMessages();

  // No `extraTracks`: the Mux assets already carry the translated tracks, so the
  // player finds them in the HLS manifest exactly as it does in production. This
  // page injected the local .vtt before that was known, which added a second
  // track in the same language and made the player's own AUTOSELECT race harder
  // to see rather than easier.
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIME_ZONE}>
      <JikiVideoPlayer playbackId={video.playbackId} />
    </NextIntlClientProvider>
  );
}
