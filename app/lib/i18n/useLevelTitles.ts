"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { fetchLevelMessages, resolveLevelTitle, type LevelMessageCatalog } from "@/lib/api/level-meta";

/**
 * Level display titles for the active locale.
 *
 * The resolver always yields a string: an unresolved level id (catalog missing
 * the key, or not yet fetched) surfaces as the id itself — the loud canary, never
 * a silent English fallback (see `fetchLevelMessages`).
 */
export function useLevelTitles(): { levelTitle: (levelId: string) => string } {
  const locale = useLocale();
  const [catalog, setCatalog] = useState<LevelMessageCatalog | null>(null);

  useEffect(() => {
    let active = true;
    setCatalog(null);
    void fetchLevelMessages(locale).then((messages) => {
      if (active) {
        setCatalog(messages);
      }
    });
    return () => {
      active = false;
    };
  }, [locale]);

  return {
    levelTitle: (levelId: string) => resolveLevelTitle(catalog ?? {}, levelId)
  };
}
